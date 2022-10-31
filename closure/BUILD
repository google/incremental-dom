package(
    default_visibility = ["//visibility:public"],
)

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library", "closure_js_binary")

IDOM_SUPPRESSIONS = [
    "JSC_REQUIRES_NOT_SORTED",
]

IDOM_DEPS = [
    "@io_bazel_rules_closure//closure/templates:soy_tslib",
]


closure_js_library(
    name = "src",
    srcs = glob(["src/**/*.js"]),
    lenient = True,
    deps = IDOM_DEPS,
    suppress = IDOM_SUPPRESSIONS,
)

closure_js_library(
    name = "index",
    srcs = ["index.js"],
    exports = [":src"],
    lenient = True,
    deps = [":src"] + IDOM_DEPS,
    suppress = IDOM_SUPPRESSIONS,
)

closure_js_binary(
    name = "bin",
    deps = [":index"] + IDOM_DEPS,
    entry_points = ["goog:incrementaldom.index"],
    dependency_mode = "PRUNE_LEGACY",
)

alias(
    name = "closure",
    actual = "index",
)
