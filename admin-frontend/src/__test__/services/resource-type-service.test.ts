import { describe, it, expect, beforeEach, vi } from "vitest";
import MockAdapter from "axios-mock-adapter";

import { api } from "@/lib/axios-client";

import { getResourceTypeApi } from "@/api/get-resource-type-api";

vi.mock("@/lib/cookie", () => ({
  getAuthToken: vi.fn(),
}));

describe("get resource type api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it("doit retourner des resource type valide", async () => {
    const mockResponse = [
      {
        id: "1",
        typeRessource: "Book",
      },
      {
        id: "2",
        typeRessource: "Video",
      },
    ];

    mock.onGet("/TypeResource").reply(200, mockResponse);

    const result = await getResourceTypeApi();

    expect(result).toEqual(mockResponse);
  });

  it("doit retourner une erreur si les schema n est pas valide", async () => {
    const invalidResponse = [
      {
        id: "1",
      },
    ];

    mock.onGet("/TypeResource").reply(200, invalidResponse);

    await expect(getResourceTypeApi()).rejects.toThrow();
  });

  it("l api doit retourner une erreur", async () => {
    mock.onGet("/TypeResource").reply(500);

    await expect(getResourceTypeApi()).rejects.toThrow();
  });
});
