import { useState, useEffect, useRef, useCallback } from 'react';
import { BudgetRequirement } from '@/backend/budget/domain/budget-requirements';
import { useWidgetContext } from '@/context/budget-widget-context';

export type Message = {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
    attachments?: string[];
};

export type ConversationThread = {
    id: string;
    title: string;
    updatedAt: string;
    status: string;
};

export type WizardState = 'idle' | 'listening' | 'processing' | 'generating' | 'review';

export const useBudgetWizard = (isAdmin: boolean = false) => {
    const { leadId } = useWidgetContext();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [state, setState] = useState<WizardState>('idle');
    const [requirements, setRequirements] = useState<Partial<BudgetRequirement>>({});

    // Multi-chat State
    const [conversations, setConversations] = useState<ConversationThread[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState(false);

    // We use a generic 'admin-user' ID for now, as auth is out of scope for the wizard component itself.
    const effectiveUserId = isAdmin ? 'admin-user' : (leadId || 'unknown-lead');

    // 1. Initial Load
    useEffect(() => {
        if (!isAdmin && effectiveUserId === 'unknown-lead') return;

        loadConversations();
    }, [isAdmin, effectiveUserId]);

    const loadConversations = async () => {
        setIsLoadingChats(true);
        try {
            if (isAdmin) {
                // Admin Mode: Load all thread history
                const { getAdminConversationsAction } = await import('@/actions/chat/get-admin-conversations.action');
                const result = await getAdminConversationsAction(effectiveUserId);

                if (result.success && result.conversations && result.conversations.length > 0) {
                    setConversations(result.conversations);
                    switchConversation(result.conversations[0].id);
                }
            } else {
                // Lead Mode: Just load the default conversation for this lead
                const { getConversationAction } = await import('@/actions/chat/get-conversation.action');
                const result = await getConversationAction(effectiveUserId);

                if (result.success && result.messages) {
                    setConversationId(result.conversationId || null);
                    if (result.messages.length > 0) {
                        setMessages(result.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                            createdAt: new Date(m.createdAt),
                            attachments: m.attachments
                        })));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        } finally {
            setIsLoadingChats(false);
        }
    };

    const switchConversation = async (id: string | null) => {
        setConversationId(id);
        setMessages([]);
        setRequirements({});
        setState('idle');

        if (!id) return;

        try {
            // Re-use the existing action to get messages by conversationId, but 
            // since getConversationAction expects leadId, we have an architecture mismatch.
            // Wait, getConversationAction expects leadId, but internally it uses GetOrCreateConversationUseCase.
            // We need an action to get specifically the messages for a known conversationId.
            // Let's import the specific usecase logic inline or via action later. 
            // For now, let's load it from getConversationHistory action if it exists.
            const { getConversationHistoryAction } = await import('@/actions/chat/get-conversation-history.action');
            const result = await getConversationHistoryAction(id);

            if (result.success && result.messages) {
                setMessages(result.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    createdAt: new Date(m.createdAt),
                    attachments: m.attachments
                })));
            }
        } catch (error) {
            console.error("Error switching conversation:", error);
        }
    };

    const startNewConversation = async () => {
        if (!isAdmin) return;
        setIsLoadingChats(true);
        try {
            const { createAdminConversationAction } = await import('@/actions/chat/create-admin-conversation.action');
            const result = await createAdminConversationAction(effectiveUserId);
            if (result.success && result.conversationId) {
                // Refresh list and switch to new
                await loadConversations();
                switchConversation(result.conversationId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingChats(false);
        }
    };

    const deleteConversation = async (id: string) => {
        if (!isAdmin) return;
        try {
            const { deleteAdminConversationAction } = await import('@/actions/chat/delete-admin-conversation.action');
            await deleteAdminConversationAction(id);
            if (conversationId === id) {
                setConversationId(null);
                setMessages([]);
                setRequirements({});
            }
            // remove from state
            setConversations(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    };


    const sendMessage = async (text: string, attachments: string[] = [], llmTextOverride?: string) => {
        if ((!text.trim() && attachments.length === 0) || !conversationId) return;

        const tempId = Date.now().toString();
        const userMsg: Message = {
            id: tempId,
            role: 'user',
            content: text,
            createdAt: new Date(),
            attachments
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setState('processing');

        try {
            // 1. Persist User Message
            const { sendMessageAction } = await import('@/actions/chat/send-message.action');
            await sendMessageAction(
                conversationId,
                text,
                isAdmin ? 'admin' : 'lead',
                effectiveUserId,
                attachments
            );

            // 2. Process AI Response
            await processAIResponse(llmTextOverride || text, attachments);

        } catch (error) {
            console.error("Failed to send message:", error);
            setState('idle');
        }
    };

    const processHiddenMessage = async (context: string) => {
        if (!conversationId) return;
        setState('processing');
        await processAIResponse(context, [], true);
    };

    const processAIResponse = async (text: string, attachments: string[] = [], isHidden: boolean = false) => {
        if (!conversationId) return;

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                content: [{ text: m.content }]
            }));

            let result;
            if (isAdmin) {
                const { processAdminMessageAction } = await import('@/actions/budget/process-admin-message.action');
                result = await processAdminMessageAction(conversationId, text, history, requirements);
            } else {
                const { processClientMessageAction } = await import('@/actions/budget/process-client-message.action');
                result = await processClientMessageAction(effectiveUserId, text, history, requirements);
            }

            if (result.success && result.data) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: result.data.response,
                    createdAt: new Date(),
                };

                setMessages(prev => [...prev, aiMsg]);
                setRequirements(result.data.updatedRequirements);

                // Persist AI Message
                const { sendMessageAction } = await import('@/actions/chat/send-message.action');
                await sendMessageAction(conversationId, result.data.response, 'assistant', 'system');

                const data = result.data as any;

                if (data.isLimitReached) {
                    setState('idle');
                } else if (data.isComplete) {
                    setState('review');
                } else {
                    setState('idle');
                }
            } else {
                console.error("AI Error:", result.error);
                setState('idle');
            }
        } catch (error) {
            console.error("Failed to process AI response", error);
            setState('idle');
        }
    };

    return {
        messages,
        input,
        setInput,
        sendMessage,
        processHiddenMessage,
        state,
        requirements,
        // New exports for multi-chat UI
        conversations,
        conversationId,
        isLoadingChats,
        startNewConversation,
        switchConversation,
        deleteConversation
    };
};
