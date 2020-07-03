/* eslint-disable */
class Index {
  constructor() {
    // Rules
    const header = (text, { length }, $1, $2) => {
      return `\n<h${length}>${$2.trim()}</h${length}>`;
    };
    const multilineCode = (text, type, contents) => {
      const label = type ? `<label><span>${type}</span></label>` : '';
      const repContents = contents.replace(/(.+)/g, `<span>${type === 'bash' ? '❯ ' : ''}$1</span>`);

      return `<div class="code" ${type}>${label}<pre><code>${repContents}</code></pre></div>`;
    };
    const paragraph = (text, line) => {
      const trimmed = line.trim();
      const tagReg = /(<([^span]+|[^>]+)>)/ig;

      return tagReg.test(trimmed) ? trimmed : `${line}`;
    };

    this.regex = {
      multilineCode: /```(.*)\n([\s\S]*?)[\n]*```/g,
      inlineCode: /`(.*?)`/g,
      header: /((^|\n)#{1,6})(.*)/g,
      // header: /(#{1,6})(.*)/g,
      image: /!\[([^\[]+)\]\(([^\)]+)\)/g,
      hyperlink: /\[([^\[]+)\]\(([^\)]+)\)/g,
      bold: /(\*\*)(.*?)\1/g,
      italic: /(\s)(\*)(.*?)(\*)/g,
      underline: /__(.+)/g,
      delete: /(\~\~)(.*?)\1/g,
      quote: /\:\"(.*?)\"\:/g,
      ul: /\n\* (.*)/g,
      innerUl: /\n( {1,4})\* (.*)/g,
      exUl: /<\/ul>\s?<ul>/g,
      ol: /\n[1-9]+\. (.*)/g,
      exOl: /<\/ol>\s?<ol>/g,
      blockquote: /\n(&gt;|\>) (.*)[\s\S]*?/g,
      exBlock: /<\/blockquote><blockquote>/g,
      hr: /\n-{5,}/g,
      paragraph: /([^\s]*.+)/g,
    };

    this.templates = {
      multilineCode,
      inlineCode: '<code>$1</code>',
      header,
      image: '<img src=\'$2\' alt=\'$1\'>',
      hyperlink: '<a href=\'$2\' target="_blank">$1</a>',
      bold: '<strong>$2</strong>',
      italic: '$1<em>$3</em>',
      underline: '<u>$1</u>',
      delete: '<del>$2</del>',
      quote: '<q>$1</q>',
      ul: `\n<ul><li>$1</li></ul>`,
      innerUl: `\n<ul><li>$2</li></ul>`,
      exUl: '',
      ol: `\n<ol><li>$1</li></ol>`,
      exOl: '',
      blockquote: `<blockquote>$2</blockquote>`,
      exBlock: '\n',
      hr: '<hr/>',
      paragraph,
    };

    this.init();
  }

  init() {
    this.rules = Object.keys(this.regex)
      .map((key) => ({
        regex: this.regex[key],
        template: this.templates[key] || '',
      }));
  }

  addRule(regex, replacement) {
    Object.assign(regex, {
      global: true,
      multiline: false,
    });

    this.rules.push({
      regex,
      replacement,
    });
  }

  transform(text) {
    let resultText = text;

    this.rules.some((rule) => {
      resultText = resultText.replace(rule.regex, rule.template);
    });

    return resultText;
  }
}

export default Index;
