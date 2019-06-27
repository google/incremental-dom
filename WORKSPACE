workspace(name = 'lang')

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Fetch rules_nodejs so we can install our npm dependencies
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "1db950bbd27fb2581866e307c0130983471d4c3cd49c46063a2503ca7b6770a4",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/0.29.0/rules_nodejs-0.29.0.tar.gz"],
)

# Check the bazel version and download npm dependencies
load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "yarn_install")

# Bazel version must be at least v0.21.0 because:
#   - 0.21.0 Using --incompatible_strict_action_env flag fixes cache when running `yarn bazel`
#            (see https://github.com/angular/angular/issues/27514#issuecomment-451438271)
check_bazel_version(
    message = """
You no longer need to install Bazel on your machine.
Angular has a dependency on the @bazel/bazel package which supplies it.
Try running `yarn bazel` instead.
    (If you did run that, check that you've got a fresh `yarn install`)
""",
    minimum_bazel_version = "0.21.0",
)

# Setup the Node.js toolchain & install our npm dependencies into @npm
yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

# Install all bazel dependencies of our npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup the rules_typescript tooolchain
load("@npm_bazel_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()