const express = require("express");
const PORT = 3000;
const history = require("connect-history-api-fallback");
const serveStatic = require("serve-static");
const path = require("path");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const doc = new PDFDocument();
const fs = require("fs");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "user",
    pass: "password",
  },
});

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.use(cors());

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Обработка статических файлов
app.use("/", serveStatic(path.join(__dirname, "../dist/delivery-docs")));

// Работа со статическими файлами
app.use(express.static(path.join(__dirname, "../dist")));

// Работа со статическими файлами
app.use("/public", express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/delivery-docs/index.html"));
});
app.get("/game", (req, res) => {
  res.redirect("/");
});
app.get("/finish", (req, res) => {
  res.redirect("/");
});
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/delivery-docs/index.html"));
});
app.get("/admin", (req, res) => {
  res.redirect("/admin/login");
});
app.get("/admin/statistics", (req, res) => {
  res.redirect("/admin/login");
});
app.get("/admin/newquestion", (req, res) => {
  res.redirect("/admin/login");
});
app.get("/admin/questions", (req, res) => {
  res.redirect("/admin/login");
});

const CONFIG = {
  DB: "std_704_deliverydocs",
  USERNAME: "std_704_deliverydocs",
  PASSWORD: "12345678",
  DIALECT: "mysql",
  HOST: "std-mysql.ist.mospolytech.ru",
};

const Sequelize = require("sequelize");
const { getParsedCommandLineOfConfigFile } = require("typescript");
const sequelize = new Sequelize(CONFIG.DB, CONFIG.USERNAME, CONFIG.PASSWORD, {
  dialect: CONFIG.DIALECT,
  host: CONFIG.HOST,
});

const Customers = sequelize.define("Customers", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const Staffs = sequelize.define("Staffs", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  telephone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  birthday: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

const Orders = sequelize.define("Orders", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  senderLatitude: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senderLongitude: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senderName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senderTelephone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senderAddress: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senderEmail: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientLatitude: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientLongitude: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientTelephone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientAddress: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  recipientEmail: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  courier_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  number: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Orders.belongsTo(Staffs, {
  foreignKey: "courier_id",
  as: "courier",
});
Staffs.hasOne(Orders, {
  foreignKey: "courier_id",
  as: "courier",
});

const Op = Sequelize.Op;

// Дальше идут запросы
app.post("/api/neworder", async (req, res) => {
  try {
    let result = await Customers.findAll({
      where: {
        email: req.body.sender.email,
      },
    });
    let id = 0;
    if (result.length == 0) {
      result = await Customers.create({
        email: req.body.sender.email,
      });
      id = result.id;
    } else {
      id = result[0].id;
    }
    let count = await Orders.count({
      where: {
        senderEmail: req.body.sender.email,
        createdAt: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) },
      },
    });
    let day =
      new Date().getDate() < 10
        ? "0" + new Date().getDate()
        : new Date().getDate();
    let month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let number = `${id}/${day}${month}${year}/${count + 1}`;
    let tamplate =
      "1. Предмет договора \n1.1. По договору Исполнитель обязуется по заданию Заказчика оказывать услуги по доставке, в случае необходимости хранению различного рода отправлений, именуемых в дальнейшем  «корреспонденция» в пределах г. Иваново.\n2. Обязанности Исполнителя. Доставка по Иванову\n2.1. Исполнитель обязан принять у Заказчика корреспонденцию, доставить ее по указанному Заказчиком адресату в оговоренные сроки\n2.2. В случае невозможности доставки корреспонденции Исполнитель обязуется уведомить об этом Заказчика по телефону и вернуть корреспонденцию с указанием причины невручения. Исполнитель предоставляет Заказчику отчеты по выполненным заказам в течение суток после доставки корреспонденции.\n2.3. Заказы по доставке корреспонденции Исполнитель принимает и выполняет круглосуточно без выходных.\n2.4. Доставка корреспонденции, осуществляемая по желанию Заказчика после 18.00, а также в  праздничные и официальные выходные дни оплачивается по удвоенному тарифу или оговаривается отдельно.\n2.5. Сроки доставки корреспонденции:Корреспонденция доставляется Исполнителем в течение дня при условии, что заказ поступил не позднее 15.30.Исполнитель не гарантирует доставку корреспонденции в тот же день по заказу поступившему после 15.30. В этом случае доставка осуществляется на утро следующих суток после получения корреспонденции у Заказчика или оговаривается отдельно.\n2.6.  После доставки корреспонденции Исполнитель  при запросе  Заказчиком оригинала бланк-заказа с подписью стороны, принявшей корреспонденцию,  обязуется предоставить данный бланк-заказ.\n\n3. Обязанности Заказчика.\n3.1.Заказчик обязуется не передавать для доставки Исполнителю:\n•	вредные, легковоспламеняющиеся, взрывчатые, ядовитые и химически агрессивные вещества;\n•	наркотические средства;\n•	оружие различных видов.\n3.2.Заказчик обязуется передавать корреспонденцию в ненарушенной упаковке с указанием на конверте полного адреса, Ф.И.О., названия организации, контактного телефона получателя.\n3.3.Заказчик обязуется сообщить Исполнителю о своем несогласии с качеством доставки корреспонденции не позднее 2 рабочих дней с момента ее получения адресатом. В противном случае работы считаются выполненными.\n3.4.Заказчик обязуется производить все расчеты с Исполнителем в полном объеме и своевременно.\n\n4. Стоимость и порядок оплаты.\n4.1. Оплата услуг, предоставляемых Исполнителем по настоящему договору, производится Заказчиком в срок не более 3-х банковских дней после выставления Исполнителем счета и предоставлением акта сдачи-приемки выполненных работ. Оплата услуг Исполнителя производится Заказчиком два раза в месяц.\n4.2.  Стоимость курьерских услуг рассчитывается в соответствии с приложением № 1 к настоящему договору.\\n5. Ответственность сторон.\n5.1.Заказчик несет ответственность за нарушение своих обязательств по п.3.1. настоящего Договора в установленном действующим законодательством порядке.\n5.2.Если Заказчик хочет отправить особо ценный или дорогостоящий груз, необходимо заранее оговорить условия его доставки с представлением администрации Исполнителя, в противном случае, Исполнитель несет ответственность за этот груз как за обычный.\n5.3.Исполнитель не несет ответственность за причинение ущерба или ошибочные доставки вследствие форс-мажорных обстоятельств, находящихся вне контроля Исполнителя, а также, действия государственных органов, изменения законодательства, указания недостоверных сведений Заказчиком, повлекших за собой ошибочную доставку. Исполнитель не несет ответственности за электрические или магнитные повреждения, или стирание электронных или фотоизображений или звукозаписей, произошедших не по его вине.\n5.4. В случае, если корреспонденция не доставлена по вине Исполнителя, либо доставлена не в срок, переделка заказа и последующий заказ не оплачиваются.\n5.5. В случае, если корреспонденция утеряна и не доставлена по вине Исполнителя, то Исполнитель несёт полную материальную ответственность за восстановление данной корреспонденции;  либо, если восстановление корреспонденции невозможно, то Исполнитель возмещает ущерб Заказчику в размере, определённом независимым оценщиком, который оценивает стоимость утерянной по вине Исполнителя корреспонденции.\n\n6. Решение спорных вопросов\n6.1.Стороны примут все меры к разрешению разногласий между ними путем двухсторонних переговоров.\n6.2.В случае не достижения согласия, споры между сторонами рассматриваются в соответствии с действующим законодательством РФ.\n\n7. Сроки действия договора\n7.1. Настоящий Договор вступает в силу с момента его подписания сторонами и действует до момента его расторжения.\n7.2. Необходимым условием прекращения действия настоящего Договора является осуществление всех взаимных расчетов сторон.\n";
    result = await Orders.create({
      senderLatitude: req.body.sender.latitude,
      senderLongitude: req.body.sender.longitude,
      senderName: req.body.sender.name,
      senderTelephone: req.body.sender.telephone,
      senderAddress: req.body.sender.address,
      senderEmail: req.body.sender.email,
      recipientLongitude: req.body.recipient.longitude,
      recipientLatitude: req.body.recipient.latitude,
      recipientName: req.body.recipient.name,
      recipientTelephone: req.body.recipient.telephone,
      recipientAddress: req.body.recipient.address,
      password: req.body.password,
      status: 1,
      number: number,
    });
    let pathFile = `server/contracts/${id}-${day}${month}${year}-${
      count + 1
    }.txt`;
    fs.writeFileSync(
      pathFile,
      `Договор на оказание курьерских услуг № ${number}\n`,
      "utf8"
    );
    fs.appendFileSync(pathFile, `от № ${day}.${month}.${year} г.\n`, (err) => {
      if (err) throw err;
    });
    fs.appendFileSync(
      pathFile,
      `Общество с Ограниченной Ответственностью Документишная, именуемое в дальнейшем «Исполнитель», в лице Генерального директора Дубинского Никиты Игоревича, действующего на основании Устава, с одной стороны и
    ${req.body.sender.name}, именуемое в дальнейшем «Клиент», с другой стороны, далее совместно именуемые «Стороны», заключили настоящий Договор на оказание курьерских услуг (далее по тексту «Договор»), о нижеследующем:\n\n`,
      (err) => {
        if (err) throw err;
      }
    );
    fs.appendFileSync(pathFile, tamplate, (err) => {
      if (err) throw err;
    });
    await transporter.sendMail({
      from: '"Документишная" <documents@documentishnaya.com>',
      to: req.body.sender.email,
      subject: `Договор на оказание курьерских услуг № ${number}`,
      text: "Данное письмо содержит договор на окозание курьерских услуг от компании 'Документишная'. Если Вы не пользовались нашими услугами, удалить письмо, не открывая файл.",
      attachments: [
        {
          filename: `Договор-${id}-${day}${month}${year}-${count + 1}.txt`,
          path: pathFile,
        },
      ],
    });
    res.send(result);
  } catch (e) {
    res.status(500).send({
      message: `Произошла небольшая ошибка (${e.message})`,
    });
  }
});

app.post("/api/findorder", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.password) {
      result = await Orders.findOne({
        where: {
          id: req.body.id,
          password: req.body.password,
        },
        include: [{ model: Staffs, as: "courier" }],
      });
    } else {
      result = await Orders.findOne({
        where: {
          id: req.body.id,
        },
        attributes: ["status"],
      });
    }
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.get("/api/couriers", async (req, res) => {
  try {
    let result = await Staffs.findAll({
      where: {
        isAdmin: false,
      },
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.get("/api/orders/:start", async (req, res) => {
  try {
    let result = await Orders.findAll({
      offset: +req.params.start,
      limit: 20,
      include: [{ model: Staffs, as: "courier" }],
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.get("/api/totalOrders", async (req, res) => {
  try {
    let result = await Orders.count({
      where: {
        status: { [Op.lt]: 5 },
      },
    });
    res.send({ total: result });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.get("/api/courirs", async (req, res) => {
  try {
    let result = await Staffs.findAll({
      where: {
        isAdmin: false,
      },
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.post("/api/newcourier", async (req, res) => {
  try {
    let result = await Staffs.create({
      name: req.body.name,
      email: req.body.email,
      telephone: req.body.telephone,
      isAdmin: false,
      birthday: req.body.birthday,
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.get("/api/neworderscourier", async (req, res) => {
  try {
    let result = await Orders.findAll({
      where: {
        courier_id: null,
      },
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.post("/api/auth", async (req, res) => {
  try {
    let result = await Staffs.count({
      where: { email: req.body.email, password: req.body.password },
    });
    if (result === 0) {
      result = await Staffs.count({
        where: { email: req.body.email },
      });
      if (result == 0) {
        res.status(500).send({
          message: "Данный пользователь не найден",
        });
      } else {
        res.status(500).send({
          message: "Неверный пароль",
        });
      }
    } else {
      result = await Staffs.findOne({
        where: { email: req.body.email, password: req.body.password },
      });
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка во время авторизации (${e.message})`,
    });
  }
});

app.post("/api/findStaff", async (req, res) => {
  try {
    let result = await Staffs.count({
      where: { email: req.body.email },
    });
    if (result == 0) {
      res.status(500).send({
        message: "Данный пользователь не найден",
      });
    } else {
      result = await Staffs.findAll({
        where: { email: req.body.email },
      });
      res.send(result);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка во время авторизации (${e.message})`,
    });
  }
});

app.put("/api/addPassword", async (req, res) => {
  try {
    let result = await Staffs.update(
      {
        password: req.body.password,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка во время редактирования категории ${e.message}`,
    });
  }
});

app.put("/api/addCourierInOrder", async (req, res) => {
  try {
    let result = await Orders.update(
      {
        courier_id: req.body.courier,
        status: 2,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    result = await Orders.findAll();
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.post("/api/allCourierOrders", async (req, res) => {
  try {
    let result = await Orders.findAll({
      where: {
        courier_id: req.body.id,
        status: { [Op.lt]: 5 },
      },
      include: [{ model: Staffs, as: "courier" }],
    });
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.put("/api/changeStatus", async (req, res) => {
  try {
    let result = await Orders.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      message: `Произошла небольшая ошибка ${e.message}`,
    });
  }
});

app.use(history());

sequelize
  //.sync({ force: true })
  .sync()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
    });
    console.log("Вы успешно подключились к базе данных");
  })
  .catch((err) => console.log(err));
