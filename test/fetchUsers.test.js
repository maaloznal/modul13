import * as chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import fetchUsers from "../fetchUsers.js";

const expect = chai.expect;
chai.use(sinonChai);

describe("fetchUsers с заглушкой API", function () {
  let fetchStub;
  let consoleLogStub;
  let consoleErrorStub;

  beforeEach(function () {
    fetchStub = sinon.stub(global, "fetch");
    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");
  });

  afterEach(function () {
    if (fetchStub && fetchStub.restore) fetchStub.restore();
    if (consoleLogStub && consoleLogStub.restore) consoleLogStub.restore();
    if (consoleErrorStub && consoleErrorStub.restore)
      consoleErrorStub.restore();
  });

  it("должен корректно обрабатывать и логировать данные", async function () {
    const users = [
      { id: 1, name: "Leanne Graham" },
      { id: 2, name: "Ervin Howell" },
    ];
    const response = {
      ok: true,
      json: async () => users,
    };

    fetchStub.resolves(response);

    const result = await fetchUsers();

    expect(result).to.deep.equal(users);

    expect(fetchStub).to.have.been.calledWith(
      "https://jsonplaceholder.typicode.com/users"
    );

    expect(consoleLogStub.callCount).to.equal(users.length);
    expect(consoleLogStub.getCall(0).args[0]).to.equal("Leanne Graham");
    expect(consoleLogStub.getCall(1).args[0]).to.equal("Ervin Howell");
  });

  it("должен корректно обрабатывать ошибки API", async function () {
    fetchStub.resolves({ ok: false });

    try {
      await fetchUsers();
      throw new Error("Ожидалось, что fetchUsers выбросит ошибку");
    } catch (error) {
      expect(fetchStub).to.have.been.calledWith(
        "https://jsonplaceholder.typicode.com/users"
      );

      expect(consoleErrorStub).to.have.been.calledWith(
        "Ошибка",
        sinon.match.instanceOf(Error)
      );
    }
  });
});
