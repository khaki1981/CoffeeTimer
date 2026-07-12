(function () {
  const DB_NAME = "CoffeeTimerDB";
  const BEAN_STORE = "beans";

  function createBeanStore(db) {
    if (db.objectStoreNames.contains(BEAN_STORE)) return;

    const store = db.createObjectStore(BEAN_STORE, { keyPath: "id" });
    store.createIndex("updatedAt", "updatedAt", { unique: false });
    store.createIndex("isFavorite", "isFavorite", { unique: false });
  }

  function openDbWithVersion(version) {
    return new Promise((resolve, reject) => {
      const request = version
        ? indexedDB.open(DB_NAME, version)
        : indexedDB.open(DB_NAME);

      request.onupgradeneeded = () => {
        createBeanStore(request.result);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        reject(new Error("CoffeeTimerDB is blocked by another open tab."));
      };
    });
  }

  async function openCoffeeTimerDB() {
    const db = await openDbWithVersion();
    if (db.objectStoreNames.contains(BEAN_STORE)) return db;

    const nextVersion = db.version + 1;
    db.close();
    return openDbWithVersion(nextVersion);
  }

  function runBeanTransaction(mode, action) {
    return openCoffeeTimerDB().then((db) => (
      new Promise((resolve, reject) => {
        const transaction = db.transaction(BEAN_STORE, mode);
        const store = transaction.objectStore(BEAN_STORE);
        let result;

        transaction.oncomplete = () => {
          db.close();
          resolve(result);
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
        transaction.onabort = () => {
          db.close();
          reject(transaction.error);
        };

        result = action(store);
      })
    ));
  }

  function waitForRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function addBean(bean) {
    return runBeanTransaction("readwrite", (store) => waitForRequest(store.add(bean)));
  }

  function updateBean(bean) {
    return runBeanTransaction("readwrite", (store) => waitForRequest(store.put(bean)));
  }

  function deleteBean(id) {
    return runBeanTransaction("readwrite", (store) => waitForRequest(store.delete(id)));
  }

  function getAllBeans() {
    return runBeanTransaction("readonly", async (store) => {
      const beans = await waitForRequest(store.getAll());
      return beans.sort((first, second) => (
        String(second.updatedAt).localeCompare(String(first.updatedAt))
      ));
    });
  }

  window.openCoffeeTimerDB = openCoffeeTimerDB;
  window.addBean = addBean;
  window.getAllBeans = getAllBeans;
  window.updateBean = updateBean;
  window.deleteBean = deleteBean;
})();
