package(default_visibility = ["//:__subpackages__"])

load("//tools:ts.bzl", "ts_library")
load("//:constants.bzl", "RELEASE_FILES")

ts_library(
    name = "src",
    package_name = "@incremental_dom/src",
    module_name = "@incremental_dom/src",
    srcs = [
        ":all_files",
    ],
)

filegroup(
    name = "release_files",
    srcs = RELEASE_FILES,
)

filegroup(
    name = "all_files",
    srcs = [
        "debug.ts",
        ":release_files",
    ],
)
