import { Controller, Get, Query, Res } from "azurajs/decorators";
import type { ResponseServer } from "azurajs/types";
import type { SearchResult, SearchResponse } from "../types";

@Controller("/search")
export class SearchController {
  @Get("/")
  search(@Query("q") query: string, @Query("page") page: string, @Res() res: ResponseServer) {
    const currentPage = page ? Number(page) : 1;
    const searchTerm = query || "";

    const results: SearchResult[] = [
      { id: 1, title: `Result 1 for "${searchTerm}"`, score: 0.95 },
      { id: 2, title: `Result 2 for "${searchTerm}"`, score: 0.87 },
      { id: 3, title: `Result 3 for "${searchTerm}"`, score: 0.76 },
    ];

    const response: SearchResponse = {
      success: true,
      query: searchTerm,
      page: currentPage,
      results,
      total: results.length,
    };

    res.json(response);
  }

  @Get("/advanced")
  advancedSearch(@Query() params: Record<string, string>, @Res() res: ResponseServer) {
    res.json({
      success: true,
      filters: params,
      message: "Advanced search with multiple filters",
    });
  }
}
