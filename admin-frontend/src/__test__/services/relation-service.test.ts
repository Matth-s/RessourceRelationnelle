import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-client";

import { getRelationType } from "@/api/get-relation-type-api";

vi.mock("@/lib/cookie", () => ({
  getAuthToken: vi.fn(),
}));

describe("getRelationType", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it("should return validated relation types", async () => {
    const mockResponse = [
      {
        id: "1",
        typeRelation: "Parent",
      },
      {
        id: "2",
        typeRelation: "Friend",
      },
    ];

    mock.onGet("/typerelation").reply(200, mockResponse);

    const result = await getRelationType();

    expect(result).toEqual(mockResponse);
  });

  it("should throw if schema validation fails", async () => {
    const invalidResponse = [
      {
        id: "1",
      },
    ];

    mock.onGet("/typerelation").reply(200, invalidResponse);

    await expect(getRelationType()).rejects.toThrow();
  });

  it("should throw on api error", async () => {
    mock.onGet("/typerelation").reply(500);

    await expect(getRelationType()).rejects.toThrow();
  });
});
