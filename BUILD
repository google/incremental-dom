package(default_visibility = ["//:__subpackages__"])

load("@npm_bazel_typescript//:defs.bzl", "ts_devserver", "ts_library")
load("@build_bazel_rules_nodejs//:defs.bzl", "npm_package")
load("@build_bazel_rules_nodejs//:defs.bzl", "rollup_bundle")

### Produce umd and cjs bundles

ts_library(
    name = "dev",
    srcs = ["index.ts"],
    deps = ["//src"],
    tsickle_typed = True,
)

rollup_bundle(
  name = "bundle",
  entry_point = ":index.ts",
  deps = [":dev"],
  global_name = "IncrementalDOM",
  license_banner = "conf/license_header.txt",
)

genrule(
  name = "incremental-dom",
  srcs = [":bundle.umd.js"],
  outs = ["dist/incremental-dom.js"],
  cmd = "cp $(locations :bundle.umd.js) $@",
)

npm_package(
  name = "npm-umd",
  deps = [
      ":incremental-dom",
  ],
  replacements = {
    "DEBUG" : "true"
  }
)
 
genrule(
  name = "incremental-dom-cjs",
  srcs = [":bundle.cjs.js"],
  outs = ["dist/incremental-dom-cjs.js"],
  cmd = "cp $(locations :bundle.cjs.js) $@",
)

npm_package(
  name = "npm-cjs",
  deps = [
    ":incremental-dom-cjs",
  ],
  replacements = {
    "DEBUG" : "process.env.NODE_ENV != \"production\""
  }
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
    deps = ["//release"],
    tsickle_typed = True,
)

rollup_bundle(
  name = "min-bundle",
  entry_point = ":release_index.ts",
  deps = [":release"],
  global_name = "IncrementalDOM",
  license_banner = "conf/license_header.txt",
)

genrule(
  name = "incremental-dom-min",
  srcs = [":min-bundle.min.js"],
  outs = ["dist/incremental-dom-min.js"],
  cmd = "cp $(locations :min-bundle.min.js) $@",
)

npm_package(
  name = "npm-min",
  deps = [
    ":incremental-dom-min",
  ],
)

### Emit TS files

npm_package(
  name = "npm",
  srcs = ["package.json", "index.ts", "//src:all_files"],
  packages = [
    ":npm-min",
    ":npm-umd",
    ":npm-cjs",
  ]
)