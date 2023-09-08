const parserXML = new DOMParser();
const strXML = `
  <list>
    <student>
      <name lang="en">
        <first>Ivan</first>
        <second>Ivanov</second>
      </name>
      <age>35</age>
      <prof>teacher</prof>
    </student>
    <student>
      <name lang="ru">
        <first>Петр</first>
        <second>Петров</second>
      </name>
      <age>58</age>
      <prof>driver</prof>
    </student>
  </list>
`;

parserXML.parseFromString(strXML, 'application/xml');
const docXML = parserXML.parseFromString(strXML, 'application/xml');

const result = new Object;
const list = docXML.children[0];

result[list.nodeName] = [];

for (let i = 0; i < list.childElementCount; i++) {
  const student = list.children[i];
  result[list.nodeName].push(XMLtoObj(student));
}

function XMLtoObj(child) {
  const studentProp = child.children;
  const objResult = new Object;
  for (let i = 0; i < child.childElementCount; i ++) {
    if (studentProp[i].childElementCount === 0) {
      objResult[studentProp[i].nodeName] = studentProp[i].textContent;
    } else if (studentProp[i].attributes.length !== 0) {
      objResult[studentProp[i].attributes[0].name] = studentProp[i].attributes[0].value;
      let strName = '';
      for (let j = 0; j < studentProp[i].childElementCount; j++) {
        strName += studentProp[i].children[j].textContent;
        if (j != studentProp[i].childElementCount - 1) {
          strName += ' ';
        }
      }
      objResult[studentProp[i].nodeName] = strName;
    }
  }
  return objResult;
};

console.log(result);

// {
//   list: [
//     { name: 'Ivan Ivanov', age: 35, prof: 'teacher', lang: 'en' },
//     { name: 'Петр Петров', age: 58, prof: 'driver', lang: 'ru' },
//   ]
// }