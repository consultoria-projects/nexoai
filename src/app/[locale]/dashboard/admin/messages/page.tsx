
'use client';

import { useState, useEffect } from 'react';
import { listAdminConversationsAction } from '@/actions/chat/list-admin-conversations.action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MessageSquare, User, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminChatWindow from '@/components/admin/chat/AdminChatWindow';

export default function AdminMessagesPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadConversations();
        // Polling interval for real-time updates (could be improved with Firestore snapshot listener in future)
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadConversations = async () => {
        try {
            const result = await listAdminConversationsAction(50);
            if (result.success) {
                setConversations(result.conversations || []);
            }
        } catch (error) {
            console.error("Failed to load conversations in admin:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-6 h-screen flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                    Mensajes y Consultas
                </h1>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 border-indigo-500/30 text-indigo-400 bg-indigo-500/5 backdrop-blur-sm">
                        {conversations.length} Activos
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Conversation List Sidebar */}
                <Card className="col-span-1 md:col-span-4 lg:col-span-3 border-white/10 bg-white/5 backdrop-blur-xl flex flex-col overflow-hidden h-full">
                    <div className="p-4 border-b border-white/10 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar conversación..."
                                className="pl-9 bg-black/20 border-white/10 text-sm focus-visible:ring-indigo-500/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {isLoading && conversations.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <p className="text-center text-muted-foreground py-10 text-sm">No hay conversaciones</p>
                            ) : (
                                filteredConversations.map((conv: any) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                        className={cn(
                                            "flex flex-col gap-1.5 p-3 rounded-lg cursor-pointer transition-all border",
                                            selectedConversationId === conv.id
                                                ? "bg-indigo-500/10 border-indigo-500/30 shadow-md shadow-indigo-500/5"
                                                : "border-transparent hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "font-medium text-sm flex items-center gap-2",
                                                selectedConversationId === conv.id ? "text-indigo-400" : "text-foreground/90"
                                            )}>
                                                <User className="w-3.5 h-3.5" />
                                                {conv.leadName}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(conv.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "text-[10px] px-1.5 h-5 font-normal tracking-wide",
                                                    conv.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        conv.status === 'waiting_for_admin' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                            "bg-gray-500/10 text-gray-400"
                                                )}
                                            >
                                                {conv.status.replace(/_/g, ' ')}
                                            </Badge>
                                            {conv.unreadCount > 0 && (
                                                <Badge className="h-5 min-w-5 px-1.5 bg-indigo-500 text-white border-0 shadow-sm shadow-indigo-500/20">
                                                    {conv.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Chat Window Area */}
                <div className="col-span-1 md:col-span-8 lg:col-span-9 h-full min-h-0">
                    {selectedConversationId ? (
                        <AdminChatWindow conversationId={selectedConversationId} />
                    ) : (
                        <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="p-4 rounded-full bg-indigo-500/10 mb-2">
                                <MessageSquare className="w-10 h-10 text-indigo-400/50" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-medium text-foreground">Selecciona una conversación</h3>
                                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                    Elige un chat de la lista para ver el historial y responder a los clientes.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
