# Price List database integration
This demo follows up on the previous frontend and backend demos. When you understand this, you will be more than ready to integrate your joke database

## Debugging
To debug the frontend and the backend at the same time, you could run the backend in the vscode debugger and use the browser debugger. Alternatively, you can configure VScode to run multiple debug sessions by writing a launch.json config file. I've provided one for you and it needs to be called launch.json and needs to live in a dir called .vscode

If you keep the same app name and port number you won't need to edit the file for your lab exercise but the file is pretty readable so easy to modify if needed.

To launch the debug session, don't use F5. Click on the debug icon in the left hand menu then in the Run and Debug dropdown, select backend, frontend or full stack to debug both.

You can only debug JavaScript, but you can set breakpoints on the frontend and backend JavaScript making this incredibly helpful for debugging.

## Database
I've used MySql server as it is popular and easy to use. Postgres SQL is very popular also and only minor modifications are required if you prefer to use that

I've only implemented a single table for now to keep it simple for those of you this is new to

To create your database, follow the guidance given in the class and help videos

The data to use to populate the database is provided in various forms in /data e.g., priceList.csv. Once you have created your table, if using workbench, you can right click the table and import this .csv file

Alternatively, pricelist.sql will create the database, table and populate the table. To use this:

- In workbench use: Server | data import | Import from disk

- Choose the Import from Self-Contained File radio button

- Select the directory of the file 

- Press the start import button

- Press the schemas refresh button and you will see your new database and populated table
