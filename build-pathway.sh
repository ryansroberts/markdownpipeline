node markdown-to-json.js ./src/pandoc/CG15/pathways/Managing\ Type\ 2\ Diabetes/ managing-type-2-diabetes.md ./outputs/pre.json
node json-to-graphvis.js ./outputs/pre.json ./outputs/pre.viz
dot ./outputs/pre.viz -y > ./outputs/pre.dot
node dot-and-json-to-path.js ./outputs/pre.json ./outputs/pre.dot ./pathway-render-test/result.json