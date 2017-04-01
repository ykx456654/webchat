export default function done () {
	Promise.prototype.done = function () {
		// console.log('done')
		return Promise.resolve()
	}
}