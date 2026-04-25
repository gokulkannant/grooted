const { withGradleProperties } = require("@expo/config-plugins");

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (gradleConfig) => {
    gradleConfig.modResults = gradleConfig.modResults.filter(
      (item) => item.key !== "org.gradle.jvmargs",
    );
    gradleConfig.modResults.push({
      type: "property",
      key: "org.gradle.jvmargs",
      value: "-Xmx4096m -XX:MaxMetaspaceSize=1024m",
    });
    return gradleConfig;
  });
};
