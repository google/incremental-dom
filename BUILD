package(default_visibility = ["//:__subpackages__"])

load("@npm//@bazel/typescript:index.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "pkg_npm")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")

### Produce umd, cjs and esm bundles

ts_library(
    name = "dev",
    srcs = ["index.ts"],
    tsickle_typed = True,
    deps = ["//src"],
)

[
    rollup_bundle(
        name = "bundle.%s" % format,
        args = args,
        config_file = "rollup.config.js",
        entry_point = ":index.ts",
        format = format,
        sourcemap = "true",
        deps = [
            ":dev",
            "@npm//@rollup/plugin-buble",
        ],
    )
    for format, args in {
        "cjs": [],
        "esm": [],
        "umd": [
            # Downlevel (transpile) to ES5.
            "-p",
            "@rollup/plugin-buble",
        ],
    }.items()
]

genrule(
    name = "incremental-dom",
    srcs = [":bundle.umd.js"],
    outs = ["dist/incremental-dom.js"],
    cmd = "cp $(locations :bundle.umd.js) $@",
)

pkg_npm(
    name = "npm-umd",
    deps = [
        ":incremental-dom",
    ],
)

genrule(
    name = "incremental-dom-cjs",
    srcs = [":bundle.cjs.js"],
    outs = ["dist/incremental-dom-cjs.js"],
    cmd = "cp $(locations :bundle.cjs.js) $@",
)

pkg_npm(
    name = "npm-cjs",
    substitutions = {
        "const DEBUG = true;": "const DEBUG = process.env.NODE_ENV != \"production\";",
    },
    deps = [
        ":incremental-dom-cjs",
    ],
)

genrule(
    name = "incremental-dom-esm",
    srcs = [":bundle.esm.js"],
    outs = ["dist/incremental-dom-esm.js"],
    cmd = "cp $(locations :bundle.esm.js) $@",
)

pkg_npm(
    name = "npm-esm",
    substitutions = {
        "const DEBUG = true;": "const DEBUG = false;",
    },
    deps = [
        ":incremental-dom-esm",
    ],
)

### Produce minified bundle

## Create a second index so that it can have a reference to the release/ directory.
## Using the same index.ts would cause issues with index.closure.js being created twice.
genrule(
    name = "release_index",
    srcs = ["index.ts"],
    outs = ["release_index.ts"],
    cmd = "cat $(location index.ts) | sed -e 's/src/release/g' > $@",
)

ts_library(
    name = "release",
    srcs = [":release_index"],
    tsickle_typed = True,
    deps = ["//release"],
)

rollup_bundle(
    name = "min-bundle",
    args = [
        # Downlevel (transpile) to ES5.
        "-p",
        "@rollup/plugin-buble",
    ],
    config_file = "rollup.config.js",
    entry_point = ":release_index.ts",
    format = "umd",
    deps = [
        ":release",
        "@npm//@rollup/plugin-buble",
    ],
)

## Need to run uglify to minify instead of using .min.es5umd.js, since it uses
## Terser, which has some performance issues with the output in how it inlines
## functions.
genrule(
    name = "incremental-dom-min",
    srcs = [":min-bundle.js"],
    outs = ["dist/incremental-dom-min.js"],
    cmd = "$(location node_modules/.bin/uglifyjs) --comments --source-map=url -m -o $@ $(location min-bundle.js)",
    tools = ["node_modules/.bin/uglifyjs"],
)

pkg_npm(
    name = "npm-min",
    deps = [
        ":incremental-dom-min",
    ],
)

### Emit TS files

pkg_npm(
    name = "npm",
    package_name = "incremental-dom",
    srcs = [
        "index.ts",
        "package.json",
        "//src:all_files",
    ],
    nested_packages = [
        ":npm-cjs",
        ":npm-esm",
        ":npm-min",
        ":npm-umd",
    ],
)
