

async function getNextToken(db) {
  const res = await db.query('SELECT token_code FROM tokens ORDER BY id DESC LIMIT 1');
  const lastToken = res.rows[0]?.token_code;

  if (!lastToken) return 'A0';

  let letter = lastToken.charAt(0);
  let number = parseInt(lastToken.slice(1), 10);

  number += 1;

  if (number > 100) {
    number = 0;
    letter = letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
  }

  return letter + number;
}

module.exports = getNextToken;
