const { useEffect, useMemo, useState } = require("./core");

const [name1, setName1] = useState("hh");
const [name2, setName2] = useState("kk");
const [showAll, setShowAll] = useState(true);

const showName = useMemo(() => {
  if (showAll()) {
    return `all ${name1()} ${name2()}`;
  }
  return `name1 ${name1()}`;
});

useEffect(() => console.log(showName()));

setName1("111");

setShowAll(false);

setName2("222");
