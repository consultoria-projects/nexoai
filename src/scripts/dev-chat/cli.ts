/**
 * Dev Chat CLI - Interactive Budget Wizard Tester
 * 
 * This script simulates a conversation with the Budget Wizard AI agent
 * directly from the terminal, bypassing the UI for faster testing.
 * 
 * Usage: npx tsx --tsconfig tsconfig.cli.json src/scripts/dev-chat/cli.ts
 * 
 * NOTE: Requires the dev server to be running (npm run dev) OR use this
 * script's standalone mode which calls the Genkit flows directly.
 */

import * as readline from 'readline';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    magenta: '\x1b[35m',
};

const BASE_URL = process.env.API_URL || 'http://localhost:9002';

// State for the conversation
interface ConversationState {
    history: Array<{ role: 'user' | 'model'; content: Array<{ text: string }> }>;
    requirements: Record<string, any>;
    isComplete: boolean;
}

let state: ConversationState = {
    history: [],
    requirements: {},
    isComplete: false,
};

// Initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function printHeader() {
    console.log('\n' + colors.bright + colors.cyan + '='.repeat(60) + colors.reset);
    console.log(colors.bright + colors.cyan + '   🏗️  Basis Budget Wizard - Dev Chat CLI' + colors.reset);
    console.log(colors.bright + colors.cyan + '='.repeat(60) + colors.reset);
    console.log(colors.dim + 'Type your message to chat with the AI agent.' + colors.reset);
    console.log(colors.dim + 'Commands: /status, /generate, /reset, /exit' + colors.reset);
    console.log(colors.dim + `Server: ${BASE_URL}` + colors.reset);
    console.log(colors.bright + colors.cyan + '='.repeat(60) + colors.reset + '\n');
}

function printRequirements() {
    console.log('\n' + colors.yellow + '📋 Current Requirements:' + colors.reset);
    const reqs = state.requirements;
    if (Object.keys(reqs).length === 0) {
        console.log(colors.dim + '   (empty)' + colors.reset);
    } else {
        if (reqs.propertyType) console.log(`   • Property Type: ${reqs.propertyType}`);
        if (reqs.projectScope) console.log(`   • Project Scope: ${reqs.projectScope}`);
        if (reqs.totalAreaM2) console.log(`   • Area: ${reqs.totalAreaM2} m²`);
        if (reqs.numberOfRooms) console.log(`   • Rooms: ${reqs.numberOfRooms}`);
        if (reqs.numberOfBathrooms) console.log(`   • Bathrooms: ${reqs.numberOfBathrooms}`);
        if (reqs.qualityLevel) console.log(`   • Quality: ${reqs.qualityLevel}`);
        if (reqs.targetBudget) console.log(`   • Budget: ${reqs.targetBudget}`);
        if (reqs.urgency) console.log(`   • Urgency: ${reqs.urgency}`);
        if (reqs.detectedNeeds && reqs.detectedNeeds.length > 0) {
            console.log(`   • Detected Needs:`);
            reqs.detectedNeeds.slice(0, 5).forEach((need: string) => console.log(`     - ${need}`));
            if (reqs.detectedNeeds.length > 5) {
                console.log(`     ... and ${reqs.detectedNeeds.length - 5} more`);
            }
        }
    }
    console.log('');
}

async function sendMessage(userMessage: string) {
    console.log(colors.dim + '\n⏳ Processing...' + colors.reset);

    try {
        // Call the API endpoint
        const response = await fetch(`${BASE_URL}/api/dev-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'message',
                message: userMessage,
                history: state.history,
                requirements: state.requirements,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();

        // Update state
        state.history.push(
            { role: 'user', content: [{ text: userMessage }] },
            { role: 'model', content: [{ text: result.response }] }
        );
        state.requirements = result.updatedRequirements || {};
        state.isComplete = result.isComplete || false;

        // Print AI response
        console.log('\n' + colors.green + '🤖 Conserje:' + colors.reset);
        console.log(colors.bright + result.response + colors.reset);

        if (result.nextQuestion) {
            console.log(colors.magenta + '\n💡 Next Question: ' + result.nextQuestion + colors.reset);
        }

        if (result.isComplete) {
            console.log(colors.yellow + '\n✅ Requirements complete! Type /generate to create budget.' + colors.reset);
        }

    } catch (error: any) {
        console.log(colors.red + '\n❌ Error: ' + error.message + colors.reset);
        console.log(colors.dim + 'Make sure the dev server is running (npm run dev) and the API route exists.' + colors.reset);
    }
}

async function generateBudget() {
    console.log(colors.yellow + '\n🚀 Generating budget from requirements...' + colors.reset);
    printRequirements();

    try {
        const response = await fetch(`${BASE_URL}/api/dev-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'generate',
                requirements: state.requirements,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const result = await response.json();

        console.log(colors.green + '\n✅ Budget Generated!' + colors.reset);
        console.log(colors.bright + '━'.repeat(50) + colors.reset);
        console.log(colors.cyan + `   Total Estimated: €${result.totalEstimated?.toFixed(2) || 'N/A'}` + colors.reset);
        console.log(colors.bright + '━'.repeat(50) + colors.reset);

        if (result.lineItems) {
            console.log('\n' + colors.yellow + '📦 Line Items:' + colors.reset);
            result.lineItems.slice(0, 10).forEach((lineItem: any, i: number) => {
                const desc = lineItem.item?.description || lineItem.originalTask || 'Sin descripción';
                const price = lineItem.item?.totalPrice?.toFixed(2) || 'N/A';
                const isEstimate = lineItem.isEstimate ? ' ⚠️' : '';
                console.log(`   ${i + 1}. ${desc} - €${price}${isEstimate}`);
            });
            if (result.lineItems.length > 10) {
                console.log(`   ... and ${result.lineItems.length - 10} more items`);
            }
        }

    } catch (error: any) {
        console.log(colors.red + '\n❌ Error generating budget: ' + error.message + colors.reset);
    }
}

function resetConversation() {
    state = {
        history: [],
        requirements: {},
        isComplete: false,
    };
    console.log(colors.yellow + '\n🔄 Conversation reset.' + colors.reset);
}

function prompt() {
    rl.question(colors.cyan + '\n👤 You: ' + colors.reset, async (input) => {
        const trimmedInput = input.trim();

        if (!trimmedInput) {
            prompt();
            return;
        }

        // Handle commands
        if (trimmedInput.startsWith('/')) {
            const command = trimmedInput.toLowerCase();

            if (command === '/exit' || command === '/quit') {
                console.log(colors.yellow + '\n👋 Goodbye!' + colors.reset);
                rl.close();
                process.exit(0);
            } else if (command === '/status') {
                printRequirements();
            } else if (command === '/generate') {
                await generateBudget();
            } else if (command === '/reset') {
                resetConversation();
            } else {
                console.log(colors.red + 'Unknown command. Available: /status, /generate, /reset, /exit' + colors.reset);
            }

            prompt();
            return;
        }

        // Send message to AI
        await sendMessage(trimmedInput);
        prompt();
    });
}

// Main entry point
async function main() {
    printHeader();

    // Send initial greeting
    console.log(colors.green + '🤖 Conserje:' + colors.reset);
    console.log(colors.bright + 'Hola, soy tu arquitecto virtual. Cuéntame, ¿qué proyecto de reforma tienes en mente?' + colors.reset);

    prompt();
}

main().catch(console.error);
