load("@npm//@bazel/concatjs:index.bzl", "karma_web_test")
load("@npm//@bazel/typescript:index.bzl", "ts_library")

ts_library(
    name = "test_lib",
    srcs = glob(["**/*.ts"]),
    deps = [
        "//:dev",
        "//src",
        "@npm//@types",
    ],
)

karma_web_test(
    name = "unit_tests",
    # chai and sinon-chai are not require()d in the code, we expect them to be globals
    # bootstrap their distro first on the page.
    bootstrap = [
        "util/globals.js",
        "@npm//:node_modules/chai/chai.js",
        "@npm//:node_modules/sinon-chai/lib/sinon-chai.js",
    ],
    deps = [
        # sinon is a dep because we have a require("sinon") in our code
        # we need the bazel-generated UMD bundle so there's a matching define("sinon") in the concatjs bundle
        "@npm//sinon:sinon__umd",
        ":test_lib",
    ],
    config_file = "karma.conf.js",
)
