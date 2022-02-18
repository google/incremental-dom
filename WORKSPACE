workspace(
    name = 'incremental_dom',
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Fetch rules_nodejs so we can install our npm dependencies
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "ddb78717b802f8dd5d4c01c340ecdc007c8ced5c1df7db421d0df3d642ea0580",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.6.0/rules_nodejs-4.6.0.tar.gz"],
)

http_archive(
    name = "rules_nodejs",
    sha256 = "ddb78717b802f8dd5d4c01c340ecdc007c8ced5c1df7db421d0df3d642ea0580",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.6.0/rules_nodejs-4.6.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories")

node_repositories(package_json = ["//:package.json"])

# Check the bazel version and download npm dependencies
load("@build_bazel_rules_nodejs//:index.bzl", "check_bazel_version", "npm_install")

# Bazel version must be at least v0.21.0 because:
#   - 0.21.0 Using --incompatible_strict_action_env flag fixes cache when running `yarn bazel`
#            (see https://github.com/angular/angular/issues/27514#issuecomment-451438271)
check_bazel_version(
    message = """
You don't need to install Bazel on your machine.
Angular has a dependency on the @bazel/bazel package which supplies it.
Try running `npm run bazel` instead.
    (If you did run that, check that you've got a fresh `npm install`)
""",
    minimum_bazel_version = "0.21.0",
)

# Setup Closure tools
http_archive(
    name = "io_bazel_rules_closure",
    sha256 = "7d206c2383811f378a5ef03f4aacbcf5f47fd8650f6abbc3fa89f3a27dd8b176",
    strip_prefix = "rules_closure-0.10.0",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_closure/archive/0.10.0.tar.gz",
        "https://github.com/bazelbuild/rules_closure/archive/0.10.0.tar.gz",
    ],
)

load("@io_bazel_rules_closure//closure:repositories.bzl", "rules_closure_dependencies", "rules_closure_toolchains")
rules_closure_dependencies()
rules_closure_toolchains()

# Setup the Node.js toolchain & install our npm dependencies into @npm
npm_install(
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    sha256 = "e9abb7658b6a129740c0b3ef6f5a2370864e102a5ba5ffca2cea565829ed825a",
    urls = ["https://github.com/bazelbuild/rules_webtesting/releases/download/0.3.5/rules_webtesting.tar.gz"],
)

# Set up web testing, choose browsers we can test on
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.3.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)

# Grab `tsickle` for `tslib` sources
http_archive(
    name = "com_google_angular_tsickle_tslib",
    sha256 = "1cc046dd9f56041c03ca55f81e580aa1b1a6385fa95ed65abc0d70992231dd5a",
    strip_prefix = "tsickle-888aba275b9d7070880b64afbf3534dd55f0f72c/third_party/tslib",
    build_file = "tsickle.bzl",
    urls = [
        "https://github.com/angular/tsickle/archive/888aba275b9d7070880b64afbf3534dd55f0f72c.tar.gz",
    ],
)
