import * as vscode from "vscode";
import * as sqlite3 from "sqlite3";
import { open, Database as SqliteDatabase } from "sqlite";
import * as path from "path";

function catchError(target: Database, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    try {
      return original.apply(this, args);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return descriptor;
}

class Database {
  private _db!: SqliteDatabase<sqlite3.Database, sqlite3.Statement>;
  errored = false;

  constructor(configDir: string) {
    const dbPath = path.join(configDir, "song_info.db");
    open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
      .then((db) => (this._db = db))
      .catch((e) => {
        console.error(e);
        vscode.window.showErrorMessage("Couldn't connect to db");
        this.errored = true;
      });
  }

  /**
   * _escape()
   *
   * @param {string} str The string to escape
   *
   * @param {Quotes} quote The type of quote based on enum `Quote`
   *
   * Escapes all quotes based on the type of quote given
   */
  private _escape(str: string, quote: Quotes = Quotes.Double) {
    switch (quote) {
      case Quotes.Double:
        str = str.replace(`"`, `""`);
        break;
      case Quotes.Single:
        str = str.replace(`'`, `''`);
        break;
      default:
        console.error("Unrecognosed Quote:", quote);
        break;
    }
    return str;
  }

  /**
   * close()
   *
   * Closes the database
   */
  async close() {
    return this._db.close;
  }

  /**
   * all()
   *
   * Returns every song in the database
   */
  @catchError
  all() {
    return this._db.all<Song[]>(`SELECT * FROM songdata ORDER BY LOWER(title), title`);
  }

  /**
   * increaseNumListens()
   *
   * @param {string} filePath A way to id the song as no 2 files can have the same path
   *
   * Updates a particular songs times listened by one
   */
  @catchError
  async incrementNumListens(filePath: string) {
    await this._db.run(`UPDATE songdata SET numListens = numListens + 1 WHERE filePath LIKE "${this._escape(filePath)}"`);
  }
}

export default Database;

enum Quotes {
  Double,
  Single,
}
