const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const url =
  "https://home.kahis.go.kr/home/lkntscrinfo/selectLkntsOccrrncList.do?lstkspCl=4150&dissCl=0111&occrFromDt=20230101&occrToDt=20240101&flag&turmGubun";



app.get("/", async (req, res) => {
  const th_values = [];
  const td_values = [];
  axios({ url: url, method: "get" })
    .then((html) => {
      // console.log(result);
      const $ = cheerio.load(html.data);
      const tr_header_elem = $("td.list_title");
      for (let i=0; i<tr_header_elem.length; i++) {
        th_values.push(tr_header_elem[i].firstChild.data);
      }
      
      console.log(th_values);
      // console.log(head_tds[0].firstChild.data);
      const tr_elem_list = $("td.list_text table").find("tr");
      for (let i = 0; i < tr_elem_list.length; i++) {
        const sublist = [];
        const tr_elem = tr_elem_list[i];
        // console.log('tr_elem:                 -------------\n', tr_elem);
        const td_elem_list = tr_elem.children.filter(
          (x) => !!x.name && x.name === "td"
        );
        td_elem_list.forEach(td_elem => {
          const content = td_elem.firstChild.data.trim();
          // console.log(content.trim());
          sublist.push(content);
        });
        // console.log('td_elem_list: \n', td_elem_list[0].firstChild.data);
        td_values.push(sublist);
        console.log(td_values);
      }

      res.status(200).json({
        th: th_values,
        td: td_values
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

