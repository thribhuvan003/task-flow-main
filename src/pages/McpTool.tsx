import { useState } from 'react';
import { mcpClient } from '@/lib/mcp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Power, Server, Terminal, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Tool {
    name: string;
    description?: string;
    inputSchema: any;
}

export default function McpTool() {
    const [url, setUrl] = useState('http://localhost:3000/sse');
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [tools, setTools] = useState<Tool[]>([]);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [toolArgs, setToolArgs] = useState('{}');
    const [toolOutput, setToolOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const { toast } = useToast();

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await mcpClient.connect(url);
            setIsConnected(true);
            toast({ title: 'Connected to MCP Server' });
            await refreshTools();
        } catch (error: any) {
            toast({ title: 'Connection Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        await mcpClient.disconnect();
        setIsConnected(false);
        setTools([]);
        setSelectedTool(null);
        toast({ title: 'Disconnected' });
    };

    const refreshTools = async () => {
        try {
            const result = await mcpClient.listTools();
            setTools(result.tools as Tool[]);
        } catch (error: any) {
            toast({ title: 'Failed to list tools', description: error.message, variant: 'destructive' });
        }
    };

    const handleCallTool = async () => {
        if (!selectedTool) return;
        setIsRunning(true);
        setToolOutput('');
        try {
            const args = JSON.parse(toolArgs);
            const result = await mcpClient.callTool(selectedTool.name, args);
            setToolOutput(JSON.stringify(result, null, 2));
        } catch (error: any) {
            setToolOutput(`Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Server className="h-8 w-8 text-primary" />
                        MCP Tools
                    </h1>
                    <p className="text-muted-foreground">Connect to Model Context Protocol servers via SSE</p>
                </div>
                <div className="flex items-center gap-2">
                    {!isConnected ? (
                        <div className="flex gap-2">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="SSE URL (e.g. http://localhost:3000/sse)"
                                className="w-64"
                            />
                            <Button onClick={handleConnect} disabled={isConnecting}>
                                {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Power className="h-4 w-4 mr-2" />}
                                Connect
                            </Button>
                        </div>
                    ) : (
                        <Button variant="destructive" onClick={handleDisconnect}>
                            <Power className="h-4 w-4 mr-2" />
                            Disconnect
                        </Button>
                    )}
                </div>
            </div>

            {!isConnected && (
                <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        Connect to an MCP Server to view and use tools.
                    </CardContent>
                </Card>
            )}

            {isConnected && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tool List */}
                    <Card className="md:col-span-1 h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Terminal className="h-5 w-5" />
                                Available Tools
                            </CardTitle>
                        </CardHeader>
                        <ScrollArea className="flex-1">
                            <CardContent className="space-y-2">
                                {tools.map((tool) => (
                                    <Button
                                        key={tool.name}
                                        variant={selectedTool?.name === tool.name ? "secondary" : "ghost"}
                                        className="w-full justify-start text-left h-auto py-3"
                                        onClick={() => {
                                            setSelectedTool(tool);
                                            // Pre-fill args with schema-based template if possible, else empty JSON
                                            setToolArgs(JSON.stringify({}, null, 2));
                                            setToolOutput('');
                                        }}
                                    >
                                        <div>
                                            <div className="font-medium">{tool.name}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-2">{tool.description}</div>
                                        </div>
                                    </Button>
                                ))}
                                {tools.length === 0 && <p className="text-sm text-center text-muted-foreground p-4">No tools found.</p>}
                            </CardContent>
                        </ScrollArea>
                    </Card>

                    {/* Tool Execution */}
                    <Card className="md:col-span-2 h-[600px] flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {selectedTool ? `Run: ${selectedTool.name}` : 'Select a tool'}
                            </CardTitle>
                            {selectedTool && <CardDescription>{selectedTool.description}</CardDescription>}
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            {selectedTool ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Arguments (JSON)</label>
                                        <textarea
                                            className="w-full h-32 p-2 rounded-md border text-sm font-mono bg-background"
                                            value={toolArgs}
                                            onChange={(e) => setToolArgs(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleCallTool} disabled={isRunning}>
                                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                        Execute Tool
                                    </Button>
                                    <div className="flex-1 space-y-2 flex flex-col min-h-0">
                                        <label className="text-sm font-medium">Output</label>
                                        <div className="flex-1 rounded-md border bg-muted/50 p-2 overflow-auto font-mono text-xs whitespace-pre-wrap">
                                            {toolOutput || 'No output yet'}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Select a tool from the list to view details and execute.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
