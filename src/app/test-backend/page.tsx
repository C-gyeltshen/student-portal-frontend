"use client";

import React, { useState } from "react";
import { testAllServices, testEndpoint } from "@/utils/test-backend-connection";
import { API_CONFIG } from "@/config/api.config";

/**
 * Backend Connection Test Page
 * Navigate to /test-backend to use this
 */
export default function TestBackendPage() {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customResponse, setCustomResponse] = useState<any>(null);

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    try {
      const testResults = await testAllServices();
      setResults(testResults);
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setTesting(false);
    }
  };

  const testCustomEndpoint = async () => {
    if (!customUrl) return;

    setTesting(true);
    try {
      const result = await testEndpoint(customUrl);
      setCustomResponse(result);
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Backend Connection Test
        </h1>
        <p className="text-gray-600 mb-8">
          Test your backend services connectivity
        </p>

        {/* Configuration Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Student Management:</span>
              <span className="text-blue-600">{API_CONFIG.BASE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Finance Service:</span>
              <span className="text-blue-600">{API_CONFIG.FINANCE_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Gateway:</span>
              <span className="text-blue-600">{API_CONFIG.GATEWAY_URL}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Use Proxy:</span>
              <span className="text-blue-600">
                {API_CONFIG.USE_PROXY ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Test All Services */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test All Services</h2>

          <button
            onClick={runTests}
            disabled={testing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? "Testing..." : "Run Connection Tests"}
          </button>

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === "online"
                      ? "border-green-200 bg-green-50"
                      : result.status === "offline"
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {result.status === "online"
                          ? "✅"
                          : result.status === "offline"
                          ? "❌"
                          : "⚠️"}
                      </span>
                      <div>
                        <h3 className="font-semibold">{result.name}</h3>
                        <p className="text-sm text-gray-600 font-mono">
                          {result.url}
                        </p>
                      </div>
                    </div>
                    {result.responseTime && (
                      <span className="text-sm text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                  </div>
                  {result.error && (
                    <p className="mt-2 text-sm text-red-600">{result.error}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Custom Endpoint */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Custom Endpoint</h2>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="http://localhost:8084/api/students"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={testCustomEndpoint}
              disabled={testing || !customUrl}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Test
            </button>
          </div>

          {customResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    customResponse.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {customResponse.success ? "✅ Success" : "❌ Failed"}
                </span>
                <span className="text-sm text-gray-500">
                  {customResponse.responseTime}ms
                </span>
              </div>
              <pre className="text-xs overflow-auto p-3 bg-white rounded border">
                {JSON.stringify(
                  customResponse.data || customResponse.error,
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Test URLs:</h3>
          <div className="space-y-1 text-sm">
            <button
              onClick={() => setCustomUrl(`${API_CONFIG.BASE_URL}/students`)}
              className="block text-blue-600 hover:underline"
            >
              {API_CONFIG.BASE_URL}/students
            </button>
            <button
              onClick={() => setCustomUrl(`${API_CONFIG.BASE_URL}/programs`)}
              className="block text-blue-600 hover:underline"
            >
              {API_CONFIG.BASE_URL}/programs
            </button>
            <button
              onClick={() => setCustomUrl(`${API_CONFIG.BASE_URL}/colleges`)}
              className="block text-blue-600 hover:underline"
            >
              {API_CONFIG.BASE_URL}/colleges
            </button>
            <button
              onClick={() =>
                setCustomUrl(`${API_CONFIG.FINANCE_URL}/deduction-rules`)
              }
              className="block text-blue-600 hover:underline"
            >
              {API_CONFIG.FINANCE_URL}/deduction-rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
