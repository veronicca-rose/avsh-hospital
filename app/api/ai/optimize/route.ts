import { NextResponse } from "next/server";

type Insight = {
  title: string;
  category:
    | "Appointments"
    | "Diagnostics"
    | "Doctors"
    | "Emergency"
    | "Capacity"
    | "Finance";
  priority: "High" | "Medium" | "Low";
  observation: string;
  recommendation: string;
  impact: string;
};

function getNumber(
  value: unknown,
  fallback = 0
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function getText(
  value: unknown,
  fallback = ""
): string {
  return typeof value === "string" ? value : fallback;
}

function flattenNumbers(
  value: unknown,
  results: number[] = []
): number[] {
  if (typeof value === "number" && Number.isFinite(value)) {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => flattenNumbers(item, results));
    return results;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) =>
      flattenNumbers(item, results)
    );
  }

  return results;
}

function findNumbersByKey(
  data: any,
  keywords: string[]
): number[] {
  const results: number[] = [];

  function walk(value: any) {
    if (!value || typeof value !== "object") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    Object.entries(value).forEach(([key, child]) => {
      const normalizedKey = key.toLowerCase();

      if (
        keywords.some((keyword) =>
          normalizedKey.includes(keyword)
        )
      ) {
        if (
          typeof child === "number" &&
          Number.isFinite(child)
        ) {
          results.push(child);
        }

        if (typeof child === "string") {
          const number = getNumber(child, NaN);

          if (Number.isFinite(number)) {
            results.push(number);
          }
        }
      }

      if (child && typeof child === "object") {
        walk(child);
      }
    });
  }

  walk(data);

  return results;
}

function findAverage(
  numbers: number[]
): number {
  if (!numbers.length) {
    return 0;
  }

  return (
    numbers.reduce(
      (total, number) => total + number,
      0
    ) / numbers.length
  );
}

function createInsights(
  hospitalData: any
): Insight[] {
  const insights: Insight[] = [];

  // --------------------------------------------------
  // Appointment / waiting-time analysis
  // --------------------------------------------------

  const waitingTimes = findNumbersByKey(
    hospitalData,
    [
      "wait",
      "waiting",
      "waittime",
      "waitingtime",
    ]
  ).filter(
    (number) => number >= 0 && number <= 600
  );

  const averageWait = findAverage(waitingTimes);

  const appointmentNumbers = findNumbersByKey(
    hospitalData,
    [
      "appointment",
      "appointments",
    ]
  ).filter(
    (number) => number >= 0
  );

  const totalAppointments =
    appointmentNumbers.length
      ? Math.max(...appointmentNumbers)
      : 0;

  if (averageWait >= 30) {
    insights.push({
      title: "Extended appointment waiting time",
      category: "Appointments",
      priority: "High",
      observation: `The supplied operational data contains waiting-time values averaging approximately ${Math.round(
        averageWait
      )} minutes.`,
      recommendation:
        "Review appointment scheduling intervals, queue distribution, and doctor availability during high-demand periods.",
      impact:
        "Reducing queue pressure can improve patient flow and reduce delays.",
    });
  } else if (averageWait >= 15) {
    insights.push({
      title: "Moderate appointment waiting time",
      category: "Appointments",
      priority: "Medium",
      observation: `The available waiting-time data averages approximately ${Math.round(
        averageWait
      )} minutes.`,
      recommendation:
        "Monitor peak appointment periods and adjust scheduling capacity where operationally appropriate.",
      impact:
        "Better appointment distribution can help maintain smoother patient flow.",
    });
  } else if (waitingTimes.length) {
    insights.push({
      title: "Appointment flow is within monitored range",
      category: "Appointments",
      priority: "Low",
      observation: `The available waiting-time values average approximately ${Math.round(
        averageWait
      )} minutes.`,
      recommendation:
        "Continue monitoring waiting times across departments and branches.",
      impact:
        "Continuous monitoring helps identify emerging queue problems early.",
    });
  }

  // --------------------------------------------------
  // Capacity / bed analysis
  // --------------------------------------------------

  const occupancyNumbers = findNumbersByKey(
    hospitalData,
    [
      "occupancy",
      "occupancyrate",
      "utilization",
      "utilisation",
    ]
  ).filter(
    (number) => number >= 0 && number <= 100
  );

  const occupancy =
    occupancyNumbers.length
      ? Math.max(...occupancyNumbers)
      : 0;

  if (occupancy >= 90) {
    insights.push({
      title: "High hospital capacity utilization",
      category: "Capacity",
      priority: "High",
      observation: `The supplied data contains capacity utilization at approximately ${Math.round(
        occupancy
      )}%.`,
      recommendation:
        "Review bed availability, discharge planning, and allocation of available capacity across departments.",
      impact:
        "Better capacity coordination can reduce pressure on highly utilized areas.",
    });
  } else if (occupancy >= 75) {
    insights.push({
      title: "Capacity utilization requires monitoring",
      category: "Capacity",
      priority: "Medium",
      observation: `The available capacity data indicates utilization around ${Math.round(
        occupancy
      )}%.`,
      recommendation:
        "Continue monitoring occupancy and prepare capacity adjustments for periods of increased demand.",
      impact:
        "Early capacity planning can help prevent avoidable congestion.",
    });
  } else if (occupancyNumbers.length) {
    insights.push({
      title: "Available capacity remains measurable",
      category: "Capacity",
      priority: "Low",
      observation: `The available utilization data is approximately ${Math.round(
        occupancy
      )}%.`,
      recommendation:
        "Continue tracking bed utilization across branches and wards.",
      impact:
        "Regular monitoring supports balanced resource allocation.",
    });
  }

  // --------------------------------------------------
  // Doctor workload analysis
  // --------------------------------------------------

  const doctorWorkload = findNumbersByKey(
    hospitalData,
    [
      "doctorworkload",
      "doctorload",
      "workload",
      "patientsperdoctor",
    ]
  ).filter(
    (number) => number >= 0
  );

  const averageDoctorWorkload =
    findAverage(doctorWorkload);

  if (averageDoctorWorkload >= 15) {
    insights.push({
      title: "Doctor workload requires attention",
      category: "Doctors",
      priority: "High",
      observation:
        "The supplied operational data contains elevated doctor workload values.",
      recommendation:
        "Review doctor schedules and redistribute appointment demand where staffing capacity permits.",
      impact:
        "Balanced workloads can improve operational flow and reduce scheduling pressure.",
    });
  } else if (doctorWorkload.length) {
    insights.push({
      title: "Doctor workload monitoring",
      category: "Doctors",
      priority: "Medium",
      observation:
        "The supplied data includes doctor workload information that can be used to monitor resource distribution.",
      recommendation:
        "Compare workload across departments and branches and review uneven demand patterns.",
      impact:
        "More balanced scheduling can support efficient use of available staff.",
    });
  }

  // --------------------------------------------------
  // Diagnostic analysis
  // --------------------------------------------------

  const diagnosticNumbers = findNumbersByKey(
    hospitalData,
    [
      "diagnostic",
      "diagnostics",
      "lab",
      "laboratory",
      "test",
      "tests",
    ]
  ).filter(
    (number) => number >= 0
  );

  if (diagnosticNumbers.length) {
    const diagnosticAverage =
      findAverage(diagnosticNumbers);

    if (diagnosticAverage >= 20) {
      insights.push({
        title: "Diagnostic workload is elevated",
        category: "Diagnostics",
        priority: "High",
        observation:
          "The supplied operational data contains relatively high diagnostic workload values.",
        recommendation:
          "Review diagnostic scheduling and distribute test demand across available operational capacity.",
        impact:
          "Improved diagnostic scheduling can reduce processing bottlenecks.",
      });
    } else {
      insights.push({
        title: "Diagnostic activity identified",
        category: "Diagnostics",
        priority: "Low",
        observation:
          "The supplied data contains diagnostic activity that can be monitored across the hospital.",
        recommendation:
          "Track diagnostic demand and turnaround patterns by test type and branch.",
        impact:
          "Ongoing monitoring can identify diagnostic bottlenecks earlier.",
      });
    }
  }

  // --------------------------------------------------
  // Emergency analysis
  // --------------------------------------------------

  const emergencyNumbers = findNumbersByKey(
    hospitalData,
    [
      "emergency",
      "emergencies",
      "urgent",
    ]
  ).filter(
    (number) => number >= 0
  );

  if (emergencyNumbers.length) {
    const emergencyAverage =
      findAverage(emergencyNumbers);

    insights.push({
      title: "Emergency activity requires continuous monitoring",
      category: "Emergency",
      priority:
        emergencyAverage >= 10
          ? "High"
          : "Medium",
      observation:
        "The supplied operational data contains emergency-related activity.",
      recommendation:
        "Monitor emergency demand alongside available staff, beds, and response capacity.",
      impact:
        "Continuous monitoring can help hospital staff respond to operational pressure more quickly.",
    });
  }

  // --------------------------------------------------
  // Finance analysis
  // --------------------------------------------------

  const financialNumbers = findNumbersByKey(
    hospitalData,
    [
      "revenue",
      "payment",
      "payments",
      "income",
      "amount",
      "transaction",
    ]
  ).filter(
    (number) => number >= 0
  );

  if (financialNumbers.length) {
    const totalFinancialValue =
      financialNumbers.reduce(
        (sum, number) => sum + number,
        0
      );

    insights.push({
      title: "Payment activity identified",
      category: "Finance",
      priority: "Low",
      observation:
        "The supplied operational data contains payment or financial activity.",
      recommendation:
        "Monitor payment completion, pending transactions, and revenue patterns across hospital services.",
      impact:
        "Financial monitoring can improve visibility into operational revenue flows.",
    });
  }

  // --------------------------------------------------
  // General fallback insight
  // --------------------------------------------------

  if (insights.length === 0) {
    insights.push({
      title: "Operational data review",
      category: "Appointments",
      priority: "Low",
      observation:
        "The supplied hospital operational dataset was received successfully, but it did not contain enough recognized numeric indicators for a specific bottleneck.",
      recommendation:
        "Continue collecting structured appointment, capacity, staffing, diagnostic, emergency, and payment metrics.",
      impact:
        "More structured operational data will support more detailed analysis.",
    });
  }

  // --------------------------------------------------
  // Always provide a useful number of insights
  // --------------------------------------------------

  const fallbackInsights: Insight[] = [
    {
      title: "Monitor appointment demand",
      category: "Appointments",
      priority: "Low",
      observation:
        "Appointment activity is part of the supplied hospital operational dataset.",
      recommendation:
        "Review appointment volumes across branches and departments.",
      impact:
        "Monitoring demand supports better scheduling decisions.",
    },
    {
      title: "Review resource distribution",
      category: "Capacity",
      priority: "Low",
      observation:
        "Hospital resources should be monitored alongside operational demand.",
      recommendation:
        "Compare available capacity with demand across hospital units.",
      impact:
        "Balanced resource allocation can improve operational efficiency.",
    },
    {
      title: "Track operational workload",
      category: "Doctors",
      priority: "Low",
      observation:
        "Staff workload is an important operational indicator.",
      recommendation:
        "Continue monitoring workload across doctors and departments.",
      impact:
        "Workload visibility supports better operational planning.",
    },
  ];

  for (const fallback of fallbackInsights) {
    if (insights.length >= 6) {
      break;
    }

    const alreadyExists = insights.some(
      (item) => item.title === fallback.title
    );

    if (!alreadyExists) {
      insights.push(fallback);
    }
  }

  return insights.slice(0, 6);
}

export async function POST(request: Request) {
  try {
    console.log("=================================");
    console.log("AVSH LOCAL AI ANALYSIS STARTED");
    console.log("=================================");

    // --------------------------------------------------
    // 1. Read request body
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
    // 2. Validate hospital data
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

    const hospitalData =
      body.hospitalData;

    console.log(
      "Hospital operational data received."
    );

    // --------------------------------------------------
    // 3. Analyze data locally
    // --------------------------------------------------

    const insights =
      createInsights(hospitalData);

    // --------------------------------------------------
    // 4. Create summary
    // --------------------------------------------------

    const summary =
      `AVSH operational analysis reviewed the supplied hospital data and identified ${insights.length} operational insight${
        insights.length === 1 ? "" : "s"
      } across appointments, capacity, staffing, diagnostics, emergency operations, and financial activity where applicable.`;

    console.log(
      "Local analysis completed."
    );

    console.log(
      "Insights generated:",
      insights.length
    );

    console.log(
      "================================="
    );

    console.log(
      "AVSH LOCAL AI ANALYSIS FINISHED"
    );

    console.log(
      "================================="
    );

    // --------------------------------------------------
    // 5. Return same structure expected by frontend
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        summary,
        insights,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "AVSH LOCAL AI ROUTE ERROR"
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