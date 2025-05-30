import React from "react"
import { LhsView } from "./lhs"
import { RhsView } from "./rhsView"
import { TopBar } from "./topBar"

export const Layout = () => {
    return (
        <>
            <div className="top_bar">
                <TopBar />
            </div>
            <div className="main_screen">
                <LhsView />
                <RhsView />
            </div>
        </>
    )
}