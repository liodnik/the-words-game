package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"strconv"
	"strings"
)

func main() {
	http.HandleFunc("/", handler)
	port := 3000
	fmt.Printf("Server is running on port %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	urlPath := r.URL.Path

	parts := strings.Split(urlPath, "=")
	if len(parts) != 2 || parts[0] != "/level" {
		http.Error(w, `{"error": "Endpoint not found"}`, http.StatusNotFound)
		return
	}

	levelStr := parts[1]
	level, err := strconv.Atoi(levelStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid level parameter"}`, http.StatusBadRequest)
		return
	}

	name := getNameByLevel(level)
	filePath := path.Join("data", fmt.Sprintf("%s.json", name))

	data, err := ioutil.ReadFile(filePath)
	if err != nil {
		http.Error(w, `{"error": "Data not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func getNameByLevel(level int) string {
	names := []string{"1", "2", "3"}
	index := (level - 1) % len(names)
	return names[index]
}
