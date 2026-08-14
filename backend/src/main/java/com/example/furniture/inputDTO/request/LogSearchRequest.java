package com.example.furniture.inputDTO.request;


import org.antlr.v4.runtime.misc.NotNull;

public class LogSearchRequest {
    @NotNull
    private String term;

    private int resultCount;

    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }

    public int getResultCount() { return resultCount; }
    public void setResultCount(int resultCount) { this.resultCount = resultCount; }
}
