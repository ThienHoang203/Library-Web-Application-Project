import { useEffect, useState } from "react";
import { createProgress, getProgress, updateProgress } from "../Data/Api";

export const useReadingProgress = (bookId?: number) => {
    const [lastPage, setLastPage] = useState(12);
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (bookId)
            getProgress(bookId, token ?? "")
                .then((p) => {
                    if (p) {
                        setLastPage(p.lastPage);
                        console.log("get reading progress successfully!");
                    }
                })
                .catch((error) => {
                    const errorMessage = (error as Error).message;

                    if (errorMessage.includes("404")) {
                        createProgress(bookId, 1, token)
                            .then(() => {
                                setLastPage(1);
                                console.log("create reading progress successfully!");
                            })
                            .catch((error) => {
                                const createErrorMessage = (error as Error).message;
                                console.error("Error creating reading progress:", createErrorMessage);
                            });
                    } else {
                        console.error("Error fetching reading progress:", errorMessage);
                    }
                });
    }, [bookId]);

    const save = (page: number) => {
        setLastPage(page);
        if (bookId) {
            updateProgress(bookId, page, token);
            console.log("save reading progress successfully!");
        }
    };

    return { lastPage, save };
};
