import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-client";

import { getRelationType } from "@/api/get-relation-type-api";

vi.mock("@/lib/cookie", () => ({
  getAuthToken: vi.fn(),
}));

describe("relation type api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it("doit returner des relations valide", async () => {
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

  it("doit retourner une erreur si le schema est invalide", async () => {
    const invalidResponse = [
      {
        id: "1",
      },
    ];

    mock.onGet("/typerelation").reply(200, invalidResponse);

    await expect(getRelationType()).rejects.toThrow();
  });

  it("l'api doit retourner une erreur", async () => {
    mock.onGet("/typerelation").reply(500);

    await expect(getRelationType()).rejects.toThrow();
  });
});
