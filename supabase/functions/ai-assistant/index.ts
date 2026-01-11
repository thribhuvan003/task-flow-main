import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";
    let tools: any[] | undefined;
    let toolChoice: any | undefined;

    if (type === "suggest") {
      systemPrompt = `You are a smart project management AI assistant. Based on the current project context, suggest actionable tasks that would help the team make progress.

Consider:
- Current tasks and their statuses
- Project deadlines and priorities
- Common project management best practices
- Tasks that are blocked or overdue

Provide practical, specific suggestions that can be immediately acted upon.`;

      userPrompt = `Current project context:
${context.projects?.length ? `Projects: ${context.projects.map((p: any) => p.name).join(", ")}` : "No projects yet"}
${context.tasks?.length ? `
Current tasks:
${context.tasks.slice(0, 10).map((t: any) => `- ${t.title} (${t.status}, ${t.priority} priority)`).join("\n")}` : "No tasks yet"}

Based on this context, suggest 3-5 actionable tasks that would help move projects forward.`;

      tools = [
        {
          type: "function",
          function: {
            name: "suggest_tasks",
            description: "Return 3-5 actionable task suggestions based on project context.",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "Clear, actionable task title" },
                      description: { type: "string", description: "Brief description of what needs to be done" },
                      priority: { type: "string", enum: ["low", "medium", "high"] },
                      category: { type: "string", description: "Category like 'planning', 'development', 'review', 'documentation'" },
                      reasoning: { type: "string", description: "Why this task is suggested" }
                    },
                    required: ["title", "priority", "category", "reasoning"],
                    additionalProperties: false
                  }
                }
              },
              required: ["suggestions"],
              additionalProperties: false
            }
          }
        }
      ];
      toolChoice = { type: "function", function: { name: "suggest_tasks" } };

    } else if (type === "prioritize") {
      systemPrompt = `You are an expert at task prioritization. Analyze the given tasks and provide prioritization recommendations based on urgency, importance, dependencies, and deadlines.`;

      userPrompt = `Please analyze and prioritize these tasks:
${context.tasks?.map((t: any) => `- ${t.title} (current: ${t.priority}, status: ${t.status}, due: ${t.due_date || "no deadline"})`).join("\n") || "No tasks provided"}

Provide recommendations for which tasks should be worked on first and why.`;

      tools = [
        {
          type: "function",
          function: {
            name: "prioritize_tasks",
            description: "Return prioritization recommendations for the given tasks.",
            parameters: {
              type: "object",
              properties: {
                recommendations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      taskTitle: { type: "string" },
                      recommendedPriority: { type: "string", enum: ["low", "medium", "high"] },
                      reasoning: { type: "string" },
                      suggestedAction: { type: "string" }
                    },
                    required: ["taskTitle", "recommendedPriority", "reasoning"],
                    additionalProperties: false
                  }
                },
                summary: { type: "string", description: "Overall prioritization strategy summary" }
              },
              required: ["recommendations", "summary"],
              additionalProperties: false
            }
          }
        }
      ];
      toolChoice = { type: "function", function: { name: "prioritize_tasks" } };

    } else if (type === "chat") {
      systemPrompt = `You are a helpful AI assistant for a task management application called TaskFlow. You help users with:
- Project planning and organization
- Task management best practices
- Productivity tips
- Answering questions about their projects and tasks

Be concise, helpful, and actionable in your responses. Keep responses under 200 words unless more detail is specifically needed.`;

      userPrompt = context.message || "Hello, how can you help me?";
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    };

    if (tools) {
      body.tools = tools;
      body.tool_choice = toolChoice;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    
    // Extract the response based on whether tools were used
    let result: any;
    
    if (tools && data.choices?.[0]?.message?.tool_calls?.[0]) {
      const toolCall = data.choices[0].message.tool_calls[0];
      result = JSON.parse(toolCall.function.arguments);
    } else {
      result = { message: data.choices?.[0]?.message?.content || "No response generated" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("AI assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});