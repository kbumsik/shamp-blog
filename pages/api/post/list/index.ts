import { Client } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';
import { marked } from 'marked';

import Database from '@database/Database';
import cors from '@middleware/cors';
import logger from '@config/log.config';
import * as T from '@types';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  await cors(request, response);
  if (request.method === T.RequestMethod.GET) {
    await Database.execute(
      (database: Client) => database.query(
        SELECT_POST_LIST,
      )
        .then((result) => {
          const resultRows = result.rows.map((post) => {
            // eslint-disable-next-line no-param-reassign
            post.shortDescription = marked(post.content, { renderer: renderPlain() });
            return post;
          });

          response.json({
            success: true,
            result: resultRows,
          });
        }),
    ).then(() => {
      logger.info('[SELECT, GET /api/post/list] 게시글 조회');
    });
  }
};

const SELECT_POST_LIST = `
  SELECT * FROM (
    SELECT
      ROW_NUMBER() OVER(ORDER BY b."crtDttm" DESC) AS rownum,
      CEIL((COUNT(*) OVER() / 10.0)) AS page,
      b.*
    FROM (
      SELECT
        p.id,
        p.tags AS tag,
        p.title,
        p.content,
        p.crt_dttm AS "crtDttm",
        (SELECT COUNT(*) FROM post_like WHERE post_id = p.id) AS "likeCnt",
        (SELECT COUNT(*) FROM comment WHERE post_id = p.id AND delete_fl = false) AS "commentCnt",
        CASE WHEN (CAST(TO_CHAR(NOW() - p.crt_dttm, 'YYYYMMDDHH24MISS') AS INTEGER) < 100)
            THEN (CAST(TO_CHAR(NOW() - p.crt_dttm, 'SS') AS INTEGER)) || ' 초 전'
          WHEN (CAST(TO_CHAR(NOW() - p.crt_dttm,'YYYYMMDDHH24MISS') AS INTEGER) < 10000)
            THEN (CAST(TO_CHAR(NOW() - p.crt_dttm, 'MI') AS INTEGER)) || ' 분 전'
          WHEN (CAST(TO_CHAR(NOW() - p.crt_dttm,'YYYYMMDDHH24MISS') AS INTEGER) < 1000000)
            THEN (CAST(TO_CHAR(NOW() - p.crt_dttm, 'HH24') AS INTEGER)) || ' 시간 전'
          ELSE TO_CHAR(crt_dttm, 'YYYY년 MM월 DD일')
        END AS time
      FROM post p
      WHERE p.delete_fl = false
      ORDER BY p.crt_dttm DESC
    ) b
  ) a
`;

const htmlEscapeToText = (text: string) => text.replace(/&#[0-9]*;|&amp;/g, (escapeCode) => {
  if (escapeCode.match(/amp/)) return '&';
  return String.fromCharCode(Number(escapeCode.match(/[0-9]+/)));
});

const renderPlain = () => {
  const render = new marked.Renderer();

  render.paragraph = (text) => `${htmlEscapeToText(text)}\r\n`;

  render.heading = (text) => text;
  render.strong = (text) => text;
  render.em = (text) => text;
  render.del = (text) => text;

  render.hr = () => '';
  render.blockquote = (text) => text;

  render.list = (text) => text;
  render.listitem = (text) => text;
  render.checkbox = () => '';

  render.table = () => '';
  render.tablerow = () => '';
  render.tablecell = () => '';
  render.image = () => '';
  render.link = (href, title, text) => text;

  render.codespan = (text) => text;
  render.code = () => '';

  return render;
};

export default handler;
