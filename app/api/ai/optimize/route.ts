import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("=================================");
    console.log("AVSH AI REQUEST STARTED");
    console.log("=================================");

    // --------------------------------------------------
    // 1. Check API key
    // --------------------------------------------------

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          error:
            "OPENAI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    console.log("OpenAI API key detected.");

    // --------------------------------------------------
    // 2. Read request body
    // --------------------------------------------------

    let body: any;

    try {
      body = await request.json();
    } catch (error) {
      console.error(
        "Could not read request JSON:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid request JSON.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // 3. Validate hospital data
    // --------------------------------------------------

    if (!body?.hospitalData) {
      console.error("hospitalData missing.");

      return NextResponse.json(
        {
          success: false,
          error:
            "Hospital operational data is required.",
        },
        { status: 400 }
      );
    }

    console.log("Hospital data received.");

    // --------------------------------------------------
    // 4. Create OpenAI request
    // --------------------------------------------------

    const hospitalData = body.hospitalData;

    console.log("Sending data to OpenAI...");

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the AVSH Hospital Operations AI.

Analyze only the supplied synthetic hospital
operational data.

Your job is to help hospital administrators identify
operational bottlenecks and opportunities.

Analyze:

- Appointment queues
- Waiting times
- Hospital capacity
- Bed utilization
- Doctor workload
- Staff availability
- Diagnostic workload
- Emergency operations
- Revenue/payment patterns

IMPORTANT SAFETY RULES:

- Do not diagnose patients.
- Do not prescribe medicines.
- Do not recommend medical treatments.
- Do not change medication dosage.
- Do not make clinical decisions.
- Do not invent hospital data.
- Do not invent numerical values.
- Use only the supplied data.
- Clearly separate observations from recommendations.
- Recommendations must be reviewed by hospital staff.
- Doctors remain the source of clinical truth.

This is synthetic university-project data.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.

Use exactly this structure:

{
  "summary": "Short executive summary",
  "insights": [
    {
      "title": "Short title",
      "category": "Appointments",
      "priority": "High",
      "observation": "What the data indicates",
      "recommendation": "Practical operational recommendation",
      "impact": "Expected operational benefit"
    }
  ]
}

Allowed categories:

Appointments
Diagnostics
Doctors
Emergency
Capacity
Finance

Allowed priorities:

High
Medium
Low

Return between 3 and 6 insights.
`,

      input: JSON.stringify(hospitalData),
    });

    console.log("OpenAI request completed.");

    // --------------------------------------------------
    // 5. Inspect OpenAI response
    // --------------------------------------------------

    console.log(
      "OpenAI response object received."
    );

    console.log(
      "OpenAI response ID:",
      response.id
    );

    console.log(
      "OpenAI output length:",
      response.output?.length ?? 0
    );

    // --------------------------------------------------
    // 6. Get output text
    // --------------------------------------------------

    const outputText =
      response.output_text?.trim();

    console.log(
      "OpenAI output text length:",
      outputText?.length ?? 0
    );

    // --------------------------------------------------
    // 7. Protect against empty OpenAI response
    // --------------------------------------------------

    if (!outputText) {
      console.error(
        "OpenAI returned no output text."
      );

      console.error(
        "Full response:",
        JSON.stringify(response, null, 2)
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "OpenAI returned an empty response.",
        },
        { status: 502 }
      );
    }

    console.log(
      "Raw OpenAI output:",
      outputText
    );

    // --------------------------------------------------
    // 8. Parse JSON returned by OpenAI
    // --------------------------------------------------

    let parsedResult: any;

    try {
      parsedResult = JSON.parse(outputText);
    } catch (error) {
      console.error(
        "OpenAI returned invalid JSON."
      );

      console.error(
        "JSON parsing error:",
        error
      );

      console.error(
        "Raw output:",
        outputText
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "OpenAI returned invalid JSON.",
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // 9. Validate AI structure
    // --------------------------------------------------

    if (
      typeof parsedResult.summary !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI response is missing the summary.",
        },
        { status: 502 }
      );
    }

    if (
      !Array.isArray(parsedResult.insights)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "AI response is missing insights.",
        },
        { status: 502 }
      );
    }

    // --------------------------------------------------
    // 10. Clean insights
    // --------------------------------------------------

    const cleanedInsights =
      parsedResult.insights
        .filter(
          (item: any) =>
            item &&
            typeof item.title === "string" &&
            typeof item.category === "string" &&
            typeof item.priority === "string" &&
            typeof item.observation === "string" &&
            typeof item.recommendation ===
              "string" &&
            typeof item.impact === "string"
        )
        .map((item: any) => ({
          title: item.title,
          category: item.category,
          priority: item.priority,
          observation: item.observation,
          recommendation:
            item.recommendation,
          impact: item.impact,
        }));

    // --------------------------------------------------
    // 11. Return guaranteed JSON to frontend
    // --------------------------------------------------

    console.log(
      "Returning successful AI response."
    );

    console.log(
      "Insights:",
      cleanedInsights.length
    );

    console.log(
      "================================="
    );
    console.log(
      "AVSH AI REQUEST FINISHED"
    );
    console.log(
      "================================="
    );

    return NextResponse.json(
      {
        success: true,
        summary: parsedResult.summary,
        insights: cleanedInsights,
      },
      { status: 200 }
    );
  } catch (error) {
    // --------------------------------------------------
    // GLOBAL ERROR HANDLER
    // --------------------------------------------------

    console.error(
      "================================="
    );

    console.error(
      "AVSH AI ROUTE ERROR"
    );

    console.error(
      "================================="
    );

    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown server error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}