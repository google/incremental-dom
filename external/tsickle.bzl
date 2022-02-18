package(
    default_visibility = ["//visibility:public"],
)

load(
    "@io_bazel_rules_closure//closure:defs.bzl",
    js_module = "closure_js_library",
)


filegroup(
    name = "extern-src",
    srcs = ["externs.js"],
)

filegroup(
    name = "tslib-src",
    srcs = ["tslib.js"],
)

js_module(
    name = "extern-lib",
    srcs = [":extern-src"],
)

js_module(
    name = "tslib-lib",
    srcs = [":tslib-src"],
    suppress = [
        "JSC_MISSING_SEMICOLON",
        "reportUnknownTypes",
    ],
)

js_module(
    name = "tslib",
    exports = [
        ":extern-lib",
        ":tslib-lib",
    ],
)
