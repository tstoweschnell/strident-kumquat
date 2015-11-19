var display = {
    _timerId: 0,
    _queue: [],
	show: function (text, delay) {
	   this._queue.push({ text: text, delay: delay });
	   this._run();
	   return this;
	},
	action: function (callback, delay) {
	   this._queue.push({ callback: callback, delay: delay });
	   this._run();
	   return this;
	},
	_run: function () {
		var that = this;
		if (this._queue.length > 0) {
			var item = this._queue[0];
			var callback = item.callback;
			if (item.text !== undefined) {
				callback = function (){ console.log(item.text) };
			}
			clearTimeout(this._timerId);
			this._timerId = setTimeout(function () {
				callback.call();
				that._queue.shift();
				that._run();
			}, item.delay);
		}
	}
}


display.show("Text 1", 1000)
	   .show("Text 2", 1000)
	   .show("Text 3", 2000)
	   .action(function () { console.log("DONE") }, 3000);