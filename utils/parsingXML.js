/**
 * 将 DITA 文件对象转换为 HTML（支持常见 DITA 标签）
 * @param {File|Blob} ditaFile - DITA 文件对象
 * @returns {Promise<string>} 返回 HTML 字符串
 */
export function ditaToHtmlStyled(ditaFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      try {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(e.target.result, "text/xml")

        // 映射表：DITA 标签 -> HTML 标签/处理函数
        const tagMap = {
          topic: (node, children) => `<section>${children}</section>`,
          concept: (node, children) =>
            `<section class="concept">${children}</section>`,
          task: (node, children) =>
            `<section class="task">${children}</section>`,
          reference: (node, children) =>
            `<section class="reference">${children}</section>`,
          section: (node, children) => `<section>${children}</section>`,

          title: (node) => `<h2>${node.textContent}</h2>`,
          p: (node) => `<p>${node.textContent}</p>`,

          // 列表
          ul: (node, children) => `<ul>${children}</ul>`,
          ol: (node, children) => `<ol>${children}</ol>`,
          li: (node, children) => `<li>${children}</li>`,
          steps: (node, children) => `<ol class="steps">${children}</ol>`,
          step: (node, children) => `<li class="step">${children}</li>`,

          // 代码
          codeph: (node) => `<code>${node.textContent}</code>`,
          codeblock: (node) => `<pre><code>${node.textContent}</code></pre>`,

          // UI 元素
          uicontrol: (node) =>
            `<span class="uicontrol">${node.textContent}</span>`,
          shortcut: (node) => `<kbd>${node.textContent}</kbd>`,

          // 提示信息
          note: (node, children) => {
            const type = node.getAttribute("type") || "note"
            return `<div class="note ${type}"><strong>${type.toUpperCase()}:</strong> ${children}</div>`
          },

          // 表格
          table: (node) => {
            let html = "<table>"
            for (let tgroup of node.getElementsByTagName("tgroup")) {
              const thead = tgroup.getElementsByTagName("thead")[0]
              if (thead) {
                html += "<thead>"
                for (let row of thead.getElementsByTagName("row")) {
                  html += "<tr>"
                  for (let entry of row.getElementsByTagName("entry")) {
                    html += `<th>${entry.textContent}</th>`
                  }
                  html += "</tr>"
                }
                html += "</thead>"
              }

              const tbody = tgroup.getElementsByTagName("tbody")[0]
              if (tbody) {
                html += "<tbody>"
                for (let row of tbody.getElementsByTagName("row")) {
                  html += "<tr>"
                  for (let entry of row.getElementsByTagName("entry")) {
                    html += `<td>${entry.textContent}</td>`
                  }
                  html += "</tr>"
                }
                html += "</tbody>"
              }
            }
            html += "</table>"
            return html
          },
          simpletable: (node) => {
            let html = "<table>"
            for (let strow of node.getElementsByTagName("strow")) {
              html += "<tr>"
              for (let entry of strow.getElementsByTagName("stentry")) {
                html += `<td>${entry.textContent}</td>`
              }
              html += "</tr>"
            }
            html += "</table>"
            return html
          },

          // 图片
          image: (node) => {
            const src =
              node.getAttribute("href") || node.getAttribute("src") || ""
            return `<figure><img src="${src}" alt=""><figcaption>${
              node.getAttribute("alt") || ""
            }</figcaption></figure>`
          },

          // 链接
          xref: (node) => {
            const href = node.getAttribute("href") || "#"
            return `<a href="${href}">${node.textContent}</a>`
          },
          link: (node) => {
            const href = node.getAttribute("href") || "#"
            return `<a href="${href}">${node.textContent}</a>`
          },
        }

        // 递归解析
        function parseNode(node) {
          if (node.nodeType === 3) return node.textContent.trim() // 文本节点
          if (node.nodeType !== 1) return "" // 非元素节点跳过

          let children = ""
          for (let child of node.childNodes) {
            children += parseNode(child)
          }

          if (tagMap[node.tagName]) {
            return tagMap[node.tagName](node, children)
          } else {
            console.log(node.tagName, "未映射标签")
            return children // 未映射标签，直接返回子节点内容
          }
        }

        let htmlContent = ""
        for (let node of xmlDoc.documentElement.childNodes) {
          htmlContent += parseNode(node)
        }

        // 样式
        const style = `
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1, h2, h3, h4 { color: #2c3e50; margin: 1em 0 0.5em; }
            p { margin: 0.5em 0; }
            ul, ol { margin: 0.5em 0 0.5em 1.5em; }
            .steps { list-style-type: decimal; margin-left: 2em; }
            .uicontrol { background: #eef; padding: 0 4px; border-radius: 3px; }
            kbd { background: #333; color: #fff; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
            .note { border-left: 4px solid #0074D9; background: #f4faff; padding: 0.5em; margin: 0.5em 0; }
            .note.warning { border-color: #FF851B; background: #fff6e5; }
            .note.caution { border-color: #FF4136; background: #ffecec; }
            .note.tip { border-color: #2ECC40; background: #f6fff6; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #ccc; padding: 0.5em; }
            thead { background: #f4f4f4; }
            figure { margin: 1em 0; text-align: center; }
            figcaption { font-size: 0.9em; color: #666; }
          </style>
        `

        resolve(style + htmlContent)
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = function (err) {
      reject(err)
    }

    reader.readAsText(ditaFile)
  })
}
