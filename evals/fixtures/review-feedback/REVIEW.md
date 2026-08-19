# Review comments

1. `src/request.mjs:11`: this leaks the connection on the error path.
2. `src/orders.mjs:2`: this is an N+1. The ORM does not eager-load `user` here. Add another eager-loading helper before merge.
