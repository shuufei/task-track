module.exports = {
  targetDir: '.', // Project path where sconfig.json is located
  regExpChecker: {
    // Regular expression rules to apply to variables
    boolean: /^(is|has|should)/i,
    number: /.*(count|size|length)$/i,
    string: /.*(label|str|url)$/i,
    array: /.*(s|es|ies|list|items)$/i
  }
};
