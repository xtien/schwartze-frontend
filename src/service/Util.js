class Util {

    isNotEmpty(string) {

        return string != null && string.length > 0;
    }

    isEmpty(string) {
        return string == null || string.length === 0;
    }
}

export default new Util()
