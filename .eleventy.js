const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginRss = require('@11ty/eleventy-plugin-rss');

module.exports = function (eleventyConfig) {
  const parseDate = (str) => {
    if (str instanceof Date) {
      return str;
    }
    return Date.parse(str);
  };

  const formatPart = (part, date) =>
  new Intl.DateTimeFormat("en", part).format(date);

  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  eleventyConfig.addFilter("date_to_datetime", (obj) => {
    console.log(obj);
    const date = parseDate(obj);
    console.log(date);
    return date.toISOString();
  });

  eleventyConfig.addFilter("date_formatted", (obj) => {
    const date = parseDate(obj);

    const month = formatPart({ month: "short" }, date);
    const day = formatPart({ day: "numeric" }, date);
    const year = formatPart({ year: "numeric" }, date);

    return `${month} ${day}, ${year}`;
  });

  eleventyConfig.addFilter('urlescape', str => {
    return str.split('/').map(part => encodeURI(part)).join('/')
  })

  eleventyConfig.addCollection('posts', collection => {
    return collection.getFilteredByGlob('src/posts/*.md').reverse()
  })

  return {
    templateFormats: ["njk", "md", "html"],
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "www",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: false,
  };
};
