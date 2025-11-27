/**
 * Backend Connection Test Utility
 *
 * Use this to test if your backend services are reachable
 * Run this in browser console or create a test page
 */

import { API_CONFIG } from "@/config/api.config";

export interface ServiceStatus {
  name: string;
  url: string;
  status: "online" | "offline" | "error";
  responseTime?: number;
  error?: string;
}

/**
 * Test connection to a specific service
 */
async function testService(name: string, url: string): Promise<ServiceStatus> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        name,
        url,
        status: "online",
        responseTime,
      };
    } else {
      return {
        name,
        url,
        status: "error",
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    return {
      name,
      url,
      status: "offline",
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}

/**
 * Test all backend services
 */
export async function testAllServices(): Promise<ServiceStatus[]> {
  const services = [
    { name: "Student Management", url: `${API_CONFIG.BASE_URL}/students` },
    {
      name: "Finance Service",
      url: `${API_CONFIG.FINANCE_URL}/deduction-rules`,
    },
    { name: "API Gateway", url: API_CONFIG.GATEWAY_URL },
    { name: "User Service", url: API_CONFIG.USER_URL },
    { name: "Banking Service", url: API_CONFIG.BANKING_URL },
  ];

  console.log("🔍 Testing backend services...\n");

  const results = await Promise.all(
    services.map((service) => testService(service.name, service.url))
  );

  // Print results
  console.log("📊 Backend Service Status:");
  console.log("━".repeat(80));

  results.forEach((result) => {
    const statusIcon =
      result.status === "online"
        ? "✅"
        : result.status === "offline"
        ? "❌"
        : "⚠️";

    console.log(`${statusIcon} ${result.name.padEnd(25)} | ${result.url}`);

    if (result.responseTime) {
      console.log(`   Response Time: ${result.responseTime}ms`);
    }

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    console.log("");
  });

  console.log("━".repeat(80));

  const onlineCount = results.filter((r) => r.status === "online").length;
  console.log(`\n✅ ${onlineCount}/${results.length} services online\n`);

  return results;
}

/**
 * Test a specific API endpoint
 */
export async function testEndpoint(
  url: string,
  method: string = "GET",
  body?: any
) {
  console.log(`\n🧪 Testing: ${method} ${url}`);

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`⏱️  Response Time: ${responseTime}ms`);
    console.log("📦 Response Data:", data);

    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    console.log(`❌ Error: ${error.message}`);
    console.log(`⏱️  Response Time: ${responseTime}ms`);

    return {
      success: false,
      error: error.message,
      responseTime,
    };
  }
}

/**
 * Quick test function for browser console
 */
if (typeof window !== "undefined") {
  (window as any).testBackend = testAllServices;
  (window as any).testEndpoint = testEndpoint;

  console.log("💡 Backend test utilities loaded!");
  console.log("   Run: testBackend() to test all services");
  console.log("   Run: testEndpoint(url, method) to test specific endpoint");
}
