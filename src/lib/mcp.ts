import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class McpClient {
  private client: Client;
  private transport: SSEClientTransport | null = null;
  private connected: boolean = false;

  constructor() {
    this.client = new Client(
      {
        name: "task-flow-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      }
    );
  }

  async connect(url: string) {
    if (this.connected) {
      await this.disconnect();
    }

    this.transport = new SSEClientTransport(new URL(url));
    await this.client.connect(this.transport);
    this.connected = true;
  }

  async disconnect() {
    if (this.transport) {
      // The SDK doesn't always expose a clean disconnect on the client if transport is closed manually,
      // but we can close the transport.
      // this.client.close(); // If available
      // For now, just reset state
      this.connected = false;
      this.transport = null;
    }
  }

  async listTools() {
    if (!this.connected) throw new Error("Not connected");
    return await this.client.listTools();
  }

  async callTool(name: string, args: any) {
    if (!this.connected) throw new Error("Not connected");
    return await this.client.callTool({
      name,
      arguments: args,
    });
  }

  isConnected() {
    return this.connected;
  }
}

export const mcpClient = new McpClient();
