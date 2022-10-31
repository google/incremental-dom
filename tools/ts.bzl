
load("@io_bazel_rules_closure//closure:defs.bzl", _closure_js_library = "closure_js_library")
load("@npm//@bazel/typescript:index.bzl", _ts_library = "ts_library")


def ts_library(name, srcs = [], deps = [], **kwargs):
    """Proxy rule for declaring TypeScript libraries."""

    _ts_library(
        name = name,
        srcs = srcs,
        deps = deps,
        tsickle_typed = True,
        compiler = "//tools/tsc",
        **kwargs
    )

    native.filegroup(
        name = "%s_es5" % name,
        srcs = [":%s" % name],
        output_group = "es5_sources",
    )

    _closure_js_library(
        name = "%s_closure" % name,
        srcs = [":%s_es5" % name],
        deps = [
            "@tsickle//:tslib",
        ],
    )
