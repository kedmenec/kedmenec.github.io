/*! bz2 (C) 2019-present SheetJS LLC */
'use strict';
(function bz2() {
    // https://www.ncbi.nlm.nih.gov/IEB/ToolBox/CPP_DOC/lxr/source/src/util/compress/bzip2/crctable.c
    const crc32Table = [
        0x00000000, 0x04c11db7, 0x09823b6e, 0x0d4326d9, 0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005,
        0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61, 0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd,
        0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9, 0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75,
        0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011, 0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd,
        0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039, 0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5,
        0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81, 0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d,
        0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49, 0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95,
        0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1, 0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d,
        0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae, 0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072,
        0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16, 0x018aeb13, 0x054bf6a4, 0x0808d07d, 0x0cc9cdca,
        0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde, 0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02,
        0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066, 0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba,
        0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e, 0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692,
        0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6, 0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a,
        0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e, 0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2,
        0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686, 0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a,
        0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637, 0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb,
        0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f, 0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53,
        0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47, 0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b,
        0x0315d626, 0x07d4cb91, 0x0a97ed48, 0x0e56f0ff, 0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623,
        0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7, 0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b,
        0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f, 0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3,
        0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7, 0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b,
        0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f, 0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3,
        0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640, 0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c,
        0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8, 0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24,
        0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30, 0x029f3d35, 0x065e2082, 0x0b1d065b, 0x0fdc1bec,
        0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088, 0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654,
        0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0, 0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c,
        0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18, 0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4,
        0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0, 0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c,
        0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668, 0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4,
    ];
    // generated from 1 << i, except for 32
    const masks = [
        0x00000000, 0x00000001, 0x00000003, 0x00000007,
        0x0000000f, 0x0000001f, 0x0000003f, 0x0000007f,
        0x000000ff, 0x000001ff, 0x000003ff, 0x000007ff,
        0x00000fff, 0x00001fff, 0x00003fff, 0x00007fff,
        0x0000ffff, 0x0001ffff, 0x0003ffff, 0x0007ffff,
        0x000fffff, 0x001fffff, 0x003fffff, 0x007fffff,
        0x00ffffff, 0x01ffffff, 0x03ffffff, 0x07ffffff,
        0x0fffffff, 0x1fffffff, 0x3fffffff, -0x80000000,
    ];
    function createOrderedHuffmanTable(lengths) {
        const z = [];
        for (let i = 0; i < lengths.length; i += 1) {
            z.push([i, lengths[i]]);
        }
        z.push([lengths.length, -1]);
        const table = [];
        let start = z[0][0];
        let bits = z[0][1];
        for (let i = 0; i < z.length; i += 1) {
            const finish = z[i][0];
            const endbits = z[i][1];
            if (bits) {
                for (let code = start; code < finish; code += 1) {
                    table.push({ code, bits, symbol: undefined });
                }
            }
            start = finish;
            bits = endbits;
            if (endbits === -1) {
                break;
            }
        }
        table.sort((a, b) => ((a.bits - b.bits) || (a.code - b.code)));
        let tempBits = 0;
        let symbol = -1;
        const fastAccess = [];
        let current;
        for (let i = 0; i < table.length; i += 1) {
            const t = table[i];
            symbol += 1;
            if (t.bits !== tempBits) {
                symbol <<= t.bits - tempBits;
                tempBits = t.bits;
                current = fastAccess[tempBits] = {};
            }
            t.symbol = symbol;
            current[symbol] = t;
        }
        return {
            table,
            fastAccess,
        };
    }
    function bwtReverse(src, primary) {
        if (primary < 0 || primary >= src.length) {
            throw RangeError('Out of bound');
        }
        const unsorted = src.slice();
        src.sort((a, b) => a - b);
        const start = {};
        for (let i = src.length - 1; i >= 0; i -= 1) {
            start[src[i]] = i;
        }
        const links = [];
        for (let i = 0; i < src.length; i += 1) {
            links.push(start[unsorted[i]]++); // eslint-disable-line no-plusplus
        }
        let i;
        const first = src[i = primary];
        const ret = [];
        for (let j = 1; j < src.length; j += 1) {
            const x = src[i = links[i]];
            if (x === undefined) {
                ret.push(255);
            }
            else {
                ret.push(x);
            }
        }
        ret.push(first);
        ret.reverse();
        return ret;
    }
    function decompress(bytes, checkCRC = false) {
        let index = 0;
        let bitfield = 0;
        let bits = 0;
        const read = (n) => {
            if (n >= 32) {
                const nd = n >> 1;
                return read(nd) * (1 << nd) + read(n - nd);
            }
            while (bits < n) {
                bitfield = (bitfield << 8) + bytes[index];
                index += 1;
                bits += 8;
            }
            const m = masks[n];
            const r = (bitfield >> (bits - n)) & m;
            bits -= n;
            bitfield &= ~(m << bits);
            return r;
        };
        const magic = read(16);
        if (magic !== 0x425A) { // 'BZ'
            throw new Error('Invalid magic');
        }
        const method = read(8);
        if (method !== 0x68) { // h for huffman
            throw new Error('Invalid method');
        }
        let blocksize = read(8);
        if (blocksize >= 49 && blocksize <= 57) { // 1..9
            blocksize -= 48;
        }
        else {
            throw new Error('Invalid blocksize');
        }
        let out = new Uint8Array(bytes.length * 1.5);
        let outIndex = 0;
        let newCRC = -1;
        while (true) {
            const blocktype = read(48);
            const crc = read(32) | 0;
            if (blocktype === 0x314159265359) {
                if (read(1)) {
                    throw new Error('do not support randomised');
                }
                const pointer = read(24);
                const used = [];
                const usedGroups = read(16);
                for (let i = 1 << 15; i > 0; i >>= 1) {
                    if (!(usedGroups & i)) {
                        for (let j = 0; j < 16; j += 1) {
                            used.push(false);
                        }
                        continue; // eslint-disable-line no-continue
                    }
                    const usedChars = read(16);
                    for (let j = 1 << 15; j > 0; j >>= 1) {
                        used.push(!!(usedChars & j));
                    }
                }
                const groups = read(3);
                if (groups < 2 || groups > 6) {
                    throw new Error('Invalid number of huffman groups');
                }
                const selectorsUsed = read(15);
                const selectors = [];
                const mtf = Array.from({ length: groups }, (_, i) => i);
                for (let i = 0; i < selectorsUsed; i += 1) {
                    let c = 0;
                    while (read(1)) {
                        c += 1;
                        if (c >= groups) {
                            throw new Error('MTF table out of range');
                        }
                    }
                    const v = mtf[c];
                    for (let j = c; j > 0; mtf[j] = mtf[--j]) { // eslint-disable-line no-plusplus
                        // nothing
                    }
                    selectors.push(v);
                    mtf[0] = v;
                }
                const symbolsInUse = used.reduce((a, b) => a + b, 0) + 2;
                const tables = [];
                for (let i = 0; i < groups; i += 1) {
                    let length = read(5);
                    const lengths = [];
                    for (let j = 0; j < symbolsInUse; j += 1) {
                        if (length < 0 || length > 20) {
                            throw new Error('Huffman group length outside range');
                        }
                        while (read(1)) {
                            length -= (read(1) * 2) - 1;
                        }
                        lengths.push(length);
                    }
                    tables.push(createOrderedHuffmanTable(lengths));
                }
                const favourites = [];
                for (let i = 0; i < used.length - 1; i += 1) {
                    if (used[i]) {
                        favourites.push(i);
                    }
                }
                let decoded = 0;
                let selectorPointer = 0;
                let t;
                let r;
                let repeat = 0;
                let repeatPower = 0;
                const buffer = [];
                while (true) {
                    decoded -= 1;
                    if (decoded <= 0) {
                        decoded = 50;
                        if (selectorPointer <= selectors.length) {
                            t = tables[selectors[selectorPointer]];
                            selectorPointer += 1;
                        }
                    }
                    for (const b in t.fastAccess) {
                        if (!Object.prototype.hasOwnProperty.call(t.fastAccess, b)) {
                            continue; // eslint-disable-line no-continue
                        }
                        if (bits < b) {
                            bitfield = (bitfield << 8) + bytes[index];
                            index += 1;
                            bits += 8;
                        }
                        r = t.fastAccess[b][bitfield >> (bits - b)];
                        if (r) {
                            bitfield &= masks[bits -= b];
                            r = r.code;
                            break;
                        }
                    }
                    if (r >= 0 && r <= 1) {
                        if (repeat === 0) {
                            repeatPower = 1;
                        }
                        repeat += repeatPower << r;
                        repeatPower <<= 1;
                        continue; // eslint-disable-line no-continue
                    }
                    else {
                        const v = favourites[0];
                        for (; repeat > 0; repeat -= 1) {
                            buffer.push(v);
                        }
                    }
                    if (r === symbolsInUse - 1) {
                        break;
                    }
                    else {
                        const v = favourites[r - 1];
                        // eslint-disable-next-line no-plusplus
                        for (let j = r - 1; j > 0; favourites[j] = favourites[--j]) {
                            // nothing
                        }
                        favourites[0] = v;
                        buffer.push(v);
                    }
                }
                const nt = bwtReverse(buffer, pointer);
                let i = 0;
                while (i < nt.length) {
                    const c = nt[i];
                    let count = 1;
                    if ((i < nt.length - 4)
                        && nt[i + 1] === c
                        && nt[i + 2] === c
                        && nt[i + 3] === c) {
                        count = nt[i + 4] + 4;
                        i += 5;
                    }
                    else {
                        i += 1;
                    }
                    if (outIndex + count >= out.length) {
                        const old = out;
                        out = new Uint8Array(old.length * 2);
                        out.set(old);
                    }
                    for (let j = 0; j < count; j += 1) {
                        if (checkCRC) {
                            newCRC = (newCRC << 8) ^ crc32Table[((newCRC >> 24) ^ c) & 0xff];
                        }
                        out[outIndex] = c;
                        outIndex += 1;
                    }
                }
                if (checkCRC) {
                    const calculatedCRC = newCRC ^ -1;
                    if (calculatedCRC !== crc) {
                        throw new Error(`CRC mismatch: ${calculatedCRC} !== ${crc}`);
                    }
                    newCRC = -1;
                }
            }
            else if (blocktype === 0x177245385090) {
                read(bits & 0x07); // pad align
                break;
            }
            else {
                throw new Error('Invalid bz2 blocktype');
            }
        }
        return out.subarray(0, outIndex);
    }
    const exports = { decompress };
    if (typeof window !== 'undefined') {
        window.bz2 = exports; // eslint-disable-line no-undef
    }
    else {
        module.exports = exports;
    }
}());
/* eslint-disable no-bitwise */
define("lib/mtDemand", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContinuousOutputView = exports.UnitC = exports.Sign = exports.UnitB = exports.CR = exports.STX = void 0;
    exports.STX = 0x02;
    exports.CR = 0x0d;
    // const Exponent = {
    //   EXPONENT_TWO: 0,
    //   EXPONENT_ONE: 1,
    //   EXPONENT_ZERO: 2,
    //   EXPONENT_N_ONE: 3,
    //   EXPONENT_N_TWO: 4,
    //   EXPONENT_N_THREE: 5,
    //   EXPONENT_N_FOUR: 6,
    //   EXPONENT_N_FIVE: 7,
    // };
    const EXPONENT_SCALAR = [1, 1, 1, 0.1, 0.01, 0.001, 0.0001, 0.00001];
    // const Rounding = { ONE: 1, TWO: 2, FIVE: 3 };
    exports.UnitB = { POUNDS: 0, KILOGRAMS: 1 };
    const UNITB_SCALAR = [453.59237, 1000];
    const Stability = { STABLE: 0, MOVEMENT: 1 };
    // const Range = { IN_RANGE: 0, OUT_OF_RANGE: 1 };
    exports.Sign = { POSITIVE: 0, NEGATIVE: 1 };
    // const MeasurementMode = { GROSS_MASS: 0, NET_MASS: 1 };
    exports.UnitC = {
        USE_UNIT_B: 0,
        GRAMS: 1,
        TONNES: 2,
        OUNCES: 3,
        TROY_OUNCES: 4,
        PENNYWEIGHT: 5,
        TON: 6,
        FREE_UNIT: 7,
    };
    const UNITC_SCALAR = [
        0,
        1,
        1000000,
        28.349492544,
        31.103476,
        1.5551738,
        907184.7,
        1,
    ];
    class ContinuousOutputView {
        static INVALID_BUFFER = new ArrayBuffer(18);
        static SWA_OFFSET = 1;
        static SWA_SIZE = 1;
        static SWB_OFFSET = 2;
        static SWB_SIZE = 1;
        static SWC_OFFSET = 3;
        static SWC_SIZE = 1;
        static DISPLAYED_OFFSET = 4;
        static DISPLAYED_SIZE = 6;
        static TARE_OFFSET = 11;
        static TARE_SIZE = 6;
        constructor(abBytes, byteOffset = 0) {
            this.view = new DataView(abBytes, byteOffset);
            let arrayBuffer = abBytes;
            let workingOffset = byteOffset;
            // Perform a preliminary check on the data, if it doesn't look valid, swap
            // out the byte buffer for a blank one
            // TODO implement the check digit validation
            if (this.view.getUint8(0) !== exports.STX || this.view.getUint8(16) !== exports.CR) {
                this.view = new DataView(ContinuousOutputView.INVALID_BUFFER, 0);
                arrayBuffer = ContinuousOutputView.INVALID_BUFFER;
                workingOffset = 0;
            }
            this.swaView = new Uint8Array(arrayBuffer, ContinuousOutputView.SWA_OFFSET + workingOffset, ContinuousOutputView.SWA_SIZE);
            this.swbView = new Uint8Array(arrayBuffer, ContinuousOutputView.SWB_OFFSET + workingOffset, ContinuousOutputView.SWB_SIZE);
            this.swcView = new Uint8Array(arrayBuffer, ContinuousOutputView.SWC_OFFSET + workingOffset, ContinuousOutputView.SWC_SIZE);
            this.displayedWeightView = new Uint8Array(arrayBuffer, ContinuousOutputView.DISPLAYED_OFFSET + workingOffset, ContinuousOutputView.DISPLAYED_SIZE);
            this.tareWeightView = new Uint8Array(arrayBuffer, ContinuousOutputView.TARE_OFFSET + workingOffset, ContinuousOutputView.TARE_SIZE);
        }
        exponent() {
            return this.swaView[0] & 0x07;
        }
        // rounding() {
        //   return (this.swaView[0] >> 3) & 0x03;
        // }
        unitB() {
            return (this.swbView[0] >> 4) & 0x01;
        }
        stability() {
            return (this.swbView[0] >> 3) & 0x01;
        }
        // loadCondition() {
        //   return (this.swbView[0] >> 2) & 0x01;
        // }
        sign() {
            return (this.swbView[0] >> 1) & 0x01;
        }
        // measurementType() {
        //   return this.swbView[0] & 0x01;
        // }
        // resolution() {
        //   // TODO Implement this, whatever it does
        //   return (this.swcView[0] >> 3) & 0x01;
        // }
        // printStatus() {
        //   // TODO Implement this, whatever it does
        //   return (this.swcView[0] >> 2) & 0x01;
        // }
        unitC() {
            return this.swcView[0] & 0x07;
        }
        displayedWeightRaw() {
            return String.fromCharCode.apply(null, this.displayedWeightView);
        }
        // tareWeightRaw() {
        //   return String.fromCharCode.apply(null, this.tareWeightView);
        // }
        // tareWeightRaw() {
        //   return String.fromCharCode.apply(null, this.tareWeightView);
        // }
        isValid() {
            // TODO add checksum calculation in here.
            return this.view.buffer !== ContinuousOutputView.INVALID_BUFFER;
        }
        unitGramsScalar() {
            if (this.unitC() === exports.UnitC.USE_UNIT_B) {
                return UNITB_SCALAR[this.unitB()];
            }
            return UNITC_SCALAR[this.unitC()];
        }
        unitScalar() {
            return EXPONENT_SCALAR[this.exponent()];
        }
        isPositive() {
            return this.sign() === exports.Sign.POSITIVE;
        }
        isStable() {
            return this.stability() === Stability.STABLE;
        }
        displayedWeightGrams() {
            const baseWeight = parseInt(
            // Only allow 0-9 characters, which is fine as only digits, spaces and NULL characters should be present,
            // 0-9 and spaces under normal circumstances and NULL when the buffer has been swapped to the INVALID_BUFFER
            this.displayedWeightRaw().replace(/[^\d]/g, ""), 10);
            const negation = this.isPositive() ? 1 : -1;
            return negation * baseWeight * this.unitScalar() * this.unitGramsScalar();
        }
    }
    exports.ContinuousOutputView = ContinuousOutputView;
});
define("lib/rinstrumBasicFormatSpecifier", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormatEDefaults = exports.FormatDDefaults = exports.FormatCDefaults = exports.FormatBDefaults = exports.FormatADefaults = exports.getWeightDataLength = exports.getStaticTokenLength = exports.isStaticLengthToken = exports.isLiteralToken = exports.isDataToken = exports.isStatusDataToken = exports.isWeightDataToken = exports.isControlToken = exports.isModifierToken = exports.StaticTokenLengths = exports.WeightDataLengths = exports.CustomTerminationChar = exports.StatusDataOutput = exports.WeightDataType = exports.StatusCharCasingModifier = exports.ErrorStateOutputModifier = exports.LeadingZeroBlankingModifier = exports.DecimalPointModifier = exports.SignModifier = exports.WeightModifier = void 0;
    // -----------------------------------------------
    // Modifier tokens
    // -----------------------------------------------
    exports.WeightModifier = {
        WEIGHT_5_CHARS: 170,
        WEIGHT_6_CHARS: 171,
        WEIGHT_7_CHARS: 172,
        // Default
        WEIGHT_8_CHARS: 173,
        WEIGHT_9_CHARS: 174,
        // Alternatively, this could a variable length output - need to field test
        WEIGHT_NONE: 179,
    };
    exports.SignModifier = {
        SIGN_NONE: 180,
        // Default
        SIGN_SPACE_MINUS: 181,
        SIGN_PLUS_MINUS: 182,
        SIGN_ZERO_MINUS: 183,
    };
    exports.DecimalPointModifier = {
        DECIMAL_POINT_NONE: 184,
        // Default
        DECIMAL_POINT_FULL_STOP: 185,
        DECIMAL_POINT_COMMA: 186,
    };
    exports.LeadingZeroBlankingModifier = {
        LEADING_ZERO_ZERO: 187,
        // Default
        LEADING_ZERO_SPACE: 188,
    };
    exports.ErrorStateOutputModifier = {
        // Default
        ERROR_STATE_SEND_WEIGHT: 189,
        ERROR_STATE_SEND_BLANK: 190,
        ERROR_STATE_SEND_DASHES: 191,
    };
    exports.StatusCharCasingModifier = {
        // Default
        STATUS_CHARS_UPPERCASE: 192,
        STATUS_CHARS_LOWERCASE: 193,
    };
    // -----------------------------------------------
    // Data tokens
    // -----------------------------------------------
    // Weight outputs
    exports.WeightDataType = {
        SELECTED: 200,
        DISPLAYED: 201,
        GROSS: 202,
        NET: 203,
        TARE: 204,
        TOTAL: 205,
    };
    // Weight status outputs
    exports.StatusDataOutput = {
        UNITS: 210,
        COMBINED_STATUS_STANDARD: 211,
        COMBINED_STATUS_NO_MOTION: 212,
        COMBINED_STATUS_GROSS_NET_ONLY: 213,
        MOTION_M_SPACE: 214,
        MOTION_M_S: 215,
        UNITS_SPACE_ON_MOTION: 216,
        CAPACITY_CONDITION_M_C_SPACE: 217,
        CAPACITY_CONDITION_M_I_O_SPACE: 218,
        LOAD_CONDITION_I_O_U: 219,
        ZERO_Z_SPACE: 220,
        RANGE_SINGLE_1_2: 221,
        STABILITY_ST_US_OVERLOAD_OL: 222,
        TIME: 230,
        DATE: 231,
    };
    // -----------------------------------------------
    // Control tokens
    // -----------------------------------------------
    exports.CustomTerminationChar = {
        NULL_CHAR: 128,
        DO_NOT_SEND: 0,
    };
    exports.WeightDataLengths = new Map([
        // Weight values
        [exports.WeightModifier.WEIGHT_5_CHARS, 5],
        [exports.WeightModifier.WEIGHT_6_CHARS, 6],
        [exports.WeightModifier.WEIGHT_7_CHARS, 7],
        [exports.WeightModifier.WEIGHT_8_CHARS, 8],
        [exports.WeightModifier.WEIGHT_9_CHARS, 9],
        [exports.WeightModifier.WEIGHT_NONE, 0],
        // Positive/Negative sign
        [exports.SignModifier.SIGN_NONE, 0],
        [exports.SignModifier.SIGN_SPACE_MINUS, 1],
        [exports.SignModifier.SIGN_PLUS_MINUS, 1],
        [exports.SignModifier.SIGN_ZERO_MINUS, 1],
        // Decimal point
        [exports.DecimalPointModifier.DECIMAL_POINT_NONE, 0],
        [exports.DecimalPointModifier.DECIMAL_POINT_FULL_STOP, 0],
        [exports.DecimalPointModifier.DECIMAL_POINT_COMMA, 0],
        // Leading Zeros
        [exports.LeadingZeroBlankingModifier.LEADING_ZERO_ZERO, 0],
        [exports.LeadingZeroBlankingModifier.LEADING_ZERO_SPACE, 0],
        // Weight output on error condition (stability, overload, etc.)
        [exports.ErrorStateOutputModifier.ERROR_STATE_SEND_WEIGHT, 0],
        [exports.ErrorStateOutputModifier.ERROR_STATE_SEND_BLANK, 0],
        [exports.ErrorStateOutputModifier.ERROR_STATE_SEND_DASHES, 0],
        // Status output casing (upper case, lower case)
        [exports.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE, 0],
        [exports.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE, 0],
    ]);
    exports.StaticTokenLengths = new Map([
        // Measurement units
        [exports.StatusDataOutput.UNITS, 3],
        [exports.StatusDataOutput.UNITS_SPACE_ON_MOTION, 3],
        // Combined status output
        [exports.StatusDataOutput.COMBINED_STATUS_STANDARD, 1],
        [exports.StatusDataOutput.COMBINED_STATUS_NO_MOTION, 1],
        [exports.StatusDataOutput.COMBINED_STATUS_GROSS_NET_ONLY, 1],
        // Motion status
        [exports.StatusDataOutput.MOTION_M_SPACE, 1],
        [exports.StatusDataOutput.MOTION_M_S, 1],
        // Capacity status
        [exports.StatusDataOutput.CAPACITY_CONDITION_M_C_SPACE, 1],
        [exports.StatusDataOutput.CAPACITY_CONDITION_M_I_O_SPACE, 1],
        // Loading/Capacity status
        [exports.StatusDataOutput.LOAD_CONDITION_I_O_U, 1],
        // Taring/Zeroing status
        [exports.StatusDataOutput.ZERO_Z_SPACE, 1],
        // Range status
        [exports.StatusDataOutput.RANGE_SINGLE_1_2, 1],
        // Combined stabiliy and loading status
        [exports.StatusDataOutput.STABILITY_ST_US_OVERLOAD_OL, 2],
        // Date output
        [exports.StatusDataOutput.TIME, 10],
        [exports.StatusDataOutput.DATE, 10],
        // Termination character/special characters
        [exports.CustomTerminationChar.NULL_CHAR, 1],
        [exports.CustomTerminationChar.DO_NOT_SEND, 0],
    ]);
    function isModifierToken(formatToken) {
        return ((formatToken >= exports.WeightModifier.WEIGHT_5_CHARS &&
            formatToken <= exports.WeightModifier.WEIGHT_9_CHARS) ||
            (formatToken >= exports.WeightModifier.WEIGHT_NONE &&
                formatToken <= exports.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE));
    }
    exports.isModifierToken = isModifierToken;
    function isControlToken(formatToken) {
        return (formatToken === exports.CustomTerminationChar.NULL_CHAR ||
            formatToken === exports.CustomTerminationChar.DO_NOT_SEND);
    }
    exports.isControlToken = isControlToken;
    function isWeightDataToken(formatToken) {
        return (formatToken >= exports.WeightDataType.SELECTED &&
            formatToken <= exports.WeightDataType.TOTAL);
    }
    exports.isWeightDataToken = isWeightDataToken;
    function isStatusDataToken(formatToken) {
        return ((formatToken >= exports.StatusDataOutput.UNITS &&
            formatToken <= exports.StatusDataOutput.STABILITY_ST_US_OVERLOAD_OL) ||
            formatToken === exports.StatusDataOutput.TIME ||
            formatToken === exports.StatusDataOutput.DATE);
    }
    exports.isStatusDataToken = isStatusDataToken;
    function isDataToken(formatToken) {
        return isWeightDataToken(formatToken) || isStatusDataToken(formatToken);
    }
    exports.isDataToken = isDataToken;
    function isLiteralToken(formatToken) {
        return formatToken >= 0x01 && formatToken <= 0x7f;
    }
    exports.isLiteralToken = isLiteralToken;
    function isStaticLengthToken(formatToken) {
        return (isLiteralToken(formatToken) ||
            isControlToken(formatToken) ||
            isStatusDataToken(formatToken));
    }
    exports.isStaticLengthToken = isStaticLengthToken;
    function getStaticTokenLength(formatToken) {
        if (isLiteralToken(formatToken)) {
            return 1;
        }
        else if (isControlToken(formatToken) || isStatusDataToken(formatToken)) {
            return exports.StaticTokenLengths.get(formatToken);
        }
        else {
            throw Error(`Invalid token supplied "${formatToken}"`);
        }
    }
    exports.getStaticTokenLength = getStaticTokenLength;
    function getWeightDataLength(modifiers) {
        const { weightMode, signMode } = modifiers;
        return weightMode === exports.WeightModifier.WEIGHT_NONE
            ? 0
            : exports.WeightDataLengths.get(weightMode) + exports.WeightDataLengths.get(signMode);
    }
    exports.getWeightDataLength = getWeightDataLength;
    // -----------------------------------------------
    // Inbuilt Weight Format default strings
    // -----------------------------------------------
    exports.FormatADefaults = [
        exports.WeightModifier.WEIGHT_7_CHARS,
        exports.WeightDataType.SELECTED,
        exports.StatusDataOutput.COMBINED_STATUS_STANDARD,
    ];
    exports.FormatBDefaults = [
        exports.StatusDataOutput.COMBINED_STATUS_STANDARD,
        exports.WeightModifier.WEIGHT_7_CHARS,
        exports.WeightDataType.SELECTED,
        exports.StatusDataOutput.UNITS_SPACE_ON_MOTION,
    ];
    exports.FormatCDefaults = [
        exports.WeightModifier.WEIGHT_7_CHARS,
        exports.WeightDataType.SELECTED,
        exports.StatusDataOutput.COMBINED_STATUS_NO_MOTION,
        exports.StatusDataOutput.MOTION_M_SPACE,
        exports.StatusDataOutput.ZERO_Z_SPACE,
        exports.StatusDataOutput.RANGE_SINGLE_1_2,
        exports.StatusDataOutput.UNITS,
    ];
    exports.FormatDDefaults = [
        exports.SignModifier.SIGN_SPACE_MINUS,
        exports.WeightModifier.WEIGHT_7_CHARS,
        exports.WeightDataType.SELECTED,
    ];
    exports.FormatEDefaults = [
        exports.WeightModifier.WEIGHT_7_CHARS,
        exports.LeadingZeroBlankingModifier.LEADING_ZERO_ZERO,
        exports.WeightDataType.SELECTED,
        exports.StatusDataOutput.CAPACITY_CONDITION_M_C_SPACE,
        exports.StatusDataOutput.UNITS_SPACE_ON_MOTION,
        0x20,
        exports.StatusDataOutput.COMBINED_STATUS_GROSS_NET_ONLY,
        0x20,
        0x20,
    ];
});
define("lib/rinstrumBasic", ["require", "exports", "lib/rinstrumBasicFormatSpecifier"], function (require, exports, rinstrumBasicFormatSpecifier_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RinstrumBasicView = exports.FormatDefaultsUnits = exports.FormatDefaultsEndChar2 = exports.FormatDefaultsEndChar1 = exports.FormatDefaultsStartChar = exports.Units = exports.Stability = exports.Sign = void 0;
    exports.Sign = {
        NEGATIVE: 0,
        POSITIVE: 1,
    };
    exports.Stability = {
        UNSTABLE: 0,
        STABLE: 1,
    };
    exports.Units = {
        KILOGRAMS: 0,
        TONS: 1,
        GRAMS: 2,
        POUNDS: 3,
    };
    const Capacity = {
        IN_RANGE: 0,
        UNDERLOAD: 1,
        OVERLOAD: 2,
    };
    const UnitScalar = [1, 1000, 0.001, 0.45359237];
    exports.FormatDefaultsStartChar = 0x02;
    exports.FormatDefaultsEndChar1 = 0x03;
    exports.FormatDefaultsEndChar2 = 0x00;
    exports.FormatDefaultsUnits = exports.Units.KILOGRAMS;
    class RinstrumBasicView {
        static InvalidBuffer = new ArrayBuffer(0);
        /**
         *
         * @param {{ format: number[], endChar1?: string, endChar2?: string, startChar?: string }} config
         * @param {ArrayBuffer} abBytes
         */
        constructor(config, abBytes) {
            this.arrayBuffer = abBytes;
            if (!(Array.isArray(config.format) && config.format.length > 0)) {
                throw Error(`Invalid format specifier ${typeof config.format}, "${config.format}"`);
            }
            this.config = config;
            this.weightModifiers = {
                weightMode: rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_8_CHARS,
                signMode: rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_SPACE_MINUS,
            };
            this.decimalPointMode = rinstrumBasicFormatSpecifier_1.DecimalPointModifier.DECIMAL_POINT_FULL_STOP;
            this.leadingZeroMode = rinstrumBasicFormatSpecifier_1.LeadingZeroBlankingModifier.LEADING_ZERO_SPACE;
            this.weightErrorMode = rinstrumBasicFormatSpecifier_1.ErrorStateOutputModifier.ERROR_STATE_SEND_WEIGHT;
            this.weightTypeMode = rinstrumBasicFormatSpecifier_1.WeightDataType.GROSS;
            this.casingMode = rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE;
            this.stability = exports.Stability.STABLE;
            this.sign = exports.Sign.POSITIVE;
            this.units = this.getDefaultUnits();
            this.capacity = Capacity.IN_RANGE;
            this.processFormat();
            this.processData();
        }
        processFormat() {
            for (const token of this.getFormatSpecifier()) {
                switch (token) {
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_NONE:
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_5_CHARS:
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_6_CHARS:
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_7_CHARS:
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_8_CHARS:
                    case rinstrumBasicFormatSpecifier_1.WeightModifier.WEIGHT_9_CHARS:
                        this.weightModifiers.weightMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_NONE:
                    case rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_SPACE_MINUS:
                    case rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_PLUS_MINUS:
                    case rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_ZERO_MINUS:
                        this.weightModifiers.signMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.DecimalPointModifier.DECIMAL_POINT_NONE:
                    case rinstrumBasicFormatSpecifier_1.DecimalPointModifier.DECIMAL_POINT_FULL_STOP:
                    case rinstrumBasicFormatSpecifier_1.DecimalPointModifier.DECIMAL_POINT_COMMA:
                        this.decimalPointMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.LeadingZeroBlankingModifier.LEADING_ZERO_ZERO:
                    case rinstrumBasicFormatSpecifier_1.LeadingZeroBlankingModifier.LEADING_ZERO_SPACE:
                        this.leadingZeroMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.ErrorStateOutputModifier.ERROR_STATE_SEND_WEIGHT:
                    case rinstrumBasicFormatSpecifier_1.ErrorStateOutputModifier.ERROR_STATE_SEND_BLANK:
                    case rinstrumBasicFormatSpecifier_1.ErrorStateOutputModifier.ERROR_STATE_SEND_DASHES:
                        this.weightErrorMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE:
                    case rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE:
                        this.casingMode = token;
                        break;
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.SELECTED:
                        this.weightTypeMode = rinstrumBasicFormatSpecifier_1.WeightDataType.GROSS; // Default to gross until we know more information
                        break;
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.DISPLAYED:
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.GROSS:
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.NET:
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.TARE:
                    case rinstrumBasicFormatSpecifier_1.WeightDataType.TOTAL:
                        this.weightTypeMode = token;
                        break;
                    default:
                        break;
                }
            }
        }
        processData() {
            const view = new Uint8Array(this.arrayBuffer);
            const payloadFormatTokens = [
                this.getStartChar(),
                ...this.getFormatSpecifier(),
                this.getEndChar1(),
                this.getEndChar2(),
            ];
            let offset = 0;
            for (const token of payloadFormatTokens) {
                if ((0, rinstrumBasicFormatSpecifier_1.isLiteralToken)(token)) {
                    if (view[offset] !== token) {
                        // eslint-disable-next-line no-console
                        console.error(`Invalid literal encountered at index ${offset}, expected "${token}", found "${view[0]}"`);
                        this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                        return;
                    }
                    offset += (0, rinstrumBasicFormatSpecifier_1.getStaticTokenLength)(token);
                }
                else if ((0, rinstrumBasicFormatSpecifier_1.isControlToken)(token)) {
                    if (token === rinstrumBasicFormatSpecifier_1.CustomTerminationChar.NULL_CHAR) {
                        if (view[offset] !== 0) {
                            // eslint-disable-next-line no-console
                            console.error(`Invalid terminator character encountered at index ${offset}, expected "${token}", found "${view[0]}"`);
                            this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                            return;
                        }
                    }
                    else if (token === rinstrumBasicFormatSpecifier_1.CustomTerminationChar.DO_NOT_SEND) {
                        return;
                    }
                    offset += (0, rinstrumBasicFormatSpecifier_1.getStaticTokenLength)(token);
                }
                else if ((0, rinstrumBasicFormatSpecifier_1.isWeightDataToken)(token)) {
                    const dataSize = (0, rinstrumBasicFormatSpecifier_1.getWeightDataLength)(this.weightModifiers);
                    switch (token) {
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.SELECTED:
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.DISPLAYED:
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.GROSS:
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.NET:
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.TARE:
                        case rinstrumBasicFormatSpecifier_1.WeightDataType.TOTAL:
                            this.weightView = view.slice(offset, offset + dataSize);
                            if (this.weightModifiers.signMode !== rinstrumBasicFormatSpecifier_1.SignModifier.SIGN_NONE &&
                                this.weightView[0] === 0x2d) {
                                this.sign = exports.Sign.NEGATIVE;
                            }
                            break;
                        default:
                            // eslint-disable-next-line no-console
                            console.error(`Unknown weight type "${token}"`);
                    }
                    offset += dataSize;
                }
                else if ((0, rinstrumBasicFormatSpecifier_1.isStatusDataToken)(token)) {
                    const dataSize = (0, rinstrumBasicFormatSpecifier_1.getStaticTokenLength)(token);
                    const data = view.slice(offset, offset + dataSize);
                    switch (token) {
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.UNITS:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.UNITS_SPACE_ON_MOTION:
                            if (!this.processUnitsData(data)) {
                                // eslint-disable-next-line no-console
                                console.error(`Unknown unit type "${data}"`);
                                this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                                return;
                            }
                            break;
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.COMBINED_STATUS_NO_MOTION:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.COMBINED_STATUS_GROSS_NET_ONLY:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.COMBINED_STATUS_STANDARD:
                            if (!this.processCombinedStatusData(data)) {
                                // eslint-disable-next-line no-console
                                console.error(`Unknown combined status type "${data}"`);
                                this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                                return;
                            }
                            break;
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.MOTION_M_SPACE:
                            if (!this.processMotionMSpaceStatusData(data)) {
                                // eslint-disable-next-line no-console
                                console.error(`Unknown motion status type "${data}"`);
                                this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                                return;
                            }
                            break;
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.MOTION_M_S:
                            if (!this.processMotionMSStatusData(data)) {
                                // eslint-disable-next-line no-console
                                console.error(`Unknown motion status type "${data}"`);
                                this.arrayBuffer = RinstrumBasicView.InvalidBuffer;
                                return;
                            }
                            break;
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.CAPACITY_CONDITION_M_C_SPACE:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.CAPACITY_CONDITION_M_I_O_SPACE:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.LOAD_CONDITION_I_O_U:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.ZERO_Z_SPACE:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.RANGE_SINGLE_1_2:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.STABILITY_ST_US_OVERLOAD_OL:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.TIME:
                        case rinstrumBasicFormatSpecifier_1.StatusDataOutput.DATE:
                            // TODO implement me
                            break;
                        default:
                            break;
                    }
                    offset += dataSize;
                }
            }
        }
        processCombinedStatusData(arrayBuffer) {
            const statusString = String.fromCharCode
                .apply(null, arrayBuffer)
                .toLowerCase();
            switch (statusString) {
                case "g":
                    this.weightTypeMode = rinstrumBasicFormatSpecifier_1.WeightDataType.GROSS;
                    break;
                case "n":
                    this.weightTypeMode = rinstrumBasicFormatSpecifier_1.WeightDataType.NET;
                    break;
                case "e":
                    this.units = exports.Units.POUNDS;
                    break;
                case "o":
                    this.capacity = Capacity.OVERLOAD;
                    break;
                case "u":
                    this.capacity = Capacity.UNDERLOAD;
                    break;
                case "m":
                    this.stability = exports.Stability.UNSTABLE;
                    break;
                default:
                    return false;
            }
            return true;
        }
        processMotionMSpaceStatusData(arrayBuffer) {
            const statusData = arrayBuffer[0];
            if (statusData === 0x20) {
                this.stability = exports.Stability.STABLE;
            }
            else if ((this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE &&
                statusData === 0x6d) ||
                (this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE &&
                    statusData === 0x4d)) {
                this.stability = exports.Stability.UNSTABLE;
            }
            else {
                return false;
            }
            return true;
        }
        processMotionMSStatusData(arrayBuffer) {
            const statusData = arrayBuffer[0];
            if ((this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE &&
                statusData === 0x73) ||
                (this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE &&
                    statusData === 0x53)) {
                this.stability = exports.Stability.STABLE;
            }
            else if ((this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_LOWERCASE &&
                statusData === 0x6d) ||
                (this.casingMode === rinstrumBasicFormatSpecifier_1.StatusCharCasingModifier.STATUS_CHARS_UPPERCASE &&
                    statusData === 0x4d)) {
                this.stability = exports.Stability.UNSTABLE;
            }
            else {
                return false;
            }
            return true;
        }
        processUnitsData(arrayBuffer) {
            const unitString = String.fromCharCode
                .apply(null, arrayBuffer)
                .toLowerCase();
            switch (unitString) {
                case " kg":
                    this.units = exports.Units.KILOGRAMS;
                    break;
                case "  t":
                    this.units = exports.Units.TONS;
                    break;
                case "  g":
                    this.units = exports.Units.GRAMS;
                    break;
                case " lb":
                    this.units = exports.Units.POUNDS;
                    break;
                case "   ":
                    this.stability = exports.Stability.UNSTABLE;
                    break;
                default:
                    return false;
            }
            return true;
        }
        getStartChar() {
            return this.config.startChar || exports.FormatDefaultsStartChar;
        }
        getEndChar1() {
            return this.config.endChar1 || exports.FormatDefaultsEndChar1;
        }
        getEndChar2() {
            return this.config.endChar2 || exports.FormatDefaultsEndChar2;
        }
        getDefaultUnits() {
            return this.config.units || exports.FormatDefaultsUnits;
        }
        getFormatSpecifier() {
            return this.config.format;
        }
        unitScalar() {
            return UnitScalar[this.units];
        }
        isPositive() {
            return this.sign === exports.Sign.POSITIVE;
        }
        isStable() {
            return this.stability === exports.Stability.STABLE;
        }
        weightRaw() {
            return String.fromCharCode.apply(null, this.weightView);
        }
        displayedWeightGrams() {
            let weightString = this.weightRaw();
            if (this.decimalPointMode === rinstrumBasicFormatSpecifier_1.DecimalPointModifier.DECIMAL_POINT_COMMA) {
                weightString = weightString.replace(/,/g, ".");
            }
            const baseWeight = parseFloat(weightString.replace(/[^\d.]/g, ""));
            const negation = this.isPositive() ? 1 : -1;
            return negation * baseWeight * this.unitScalar() * 1000;
        }
        isValid() {
            return this.arrayBuffer !== RinstrumBasicView.InvalidBuffer;
        }
    }
    exports.RinstrumBasicView = RinstrumBasicView;
});
define("src/logEntry", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogEntry = exports.LogLevel = void 0;
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
        LogLevel[LogLevel["WARN"] = 1] = "WARN";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    class LogEntry {
        level = LogLevel.ERROR;
        timestamp = new Date();
        file = "";
        line = 0;
        payload = null;
    }
    exports.LogEntry = LogEntry;
    ;
});
define("src/indexes", ["require", "exports", "lib/rinstrumBasic", "lib/rinstrumBasicFormatSpecifier"], function (require, exports, rinstrumBasic_1, rinstrumBasicFormatSpecifier_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.indexLogEntries = void 0;
    const logEntryIndicies = {
        level: [[], [], [], []],
        file: new Map(),
        line: new Map(),
        timestamp: new Map(),
    };
    function indexLogEntries(logEntries) {
        for (var logEntry of logEntries) {
            logEntryIndicies.level[logEntry.level].push(logEntry);
            let fileIndexEntry = logEntryIndicies.file.get(logEntry.file);
            if (Array.isArray(fileIndexEntry)) {
                fileIndexEntry.push(logEntry);
            }
            else {
                logEntryIndicies.file.set(logEntry.file, [logEntry]);
            }
            let lineIndexEntry = logEntryIndicies.line.get(logEntry.line);
            if (Array.isArray(lineIndexEntry)) {
                lineIndexEntry.push(logEntry);
            }
            else {
                logEntryIndicies.line.set(logEntry.line, [logEntry]);
            }
        }
        const stableWeightSeries = [];
        const unstableWeightSeries = [];
        const eidSeries = [];
        const plcResetSeries = [];
        const plcDraftRequestSeries = [];
        const plcResponseSeries = [];
        const wsMessages = logEntryIndicies.file.get("agrinous_bridge.py");
        if (wsMessages) {
            for (const logEntry of wsMessages) {
                if (logEntry.line == 222) {
                    let parsed = null;
                    try {
                        parsed = JSON.parse(String.fromCharCode.apply(null, logEntry.payload));
                    }
                    catch (e) {
                        console.error(e);
                        continue;
                    }
                    if (parsed.event == "message") {
                        if (parsed.deviceId.startsWith("tlab-autodraft-plc")) {
                            if (parsed.object.payload.startsWith("{RR}")) {
                                plcResetSeries.push([logEntry.timestamp, 1]);
                            }
                            else if (parsed.object.payload.startsWith("{D?}")) {
                                plcDraftRequestSeries.push([logEntry.timestamp, 1]);
                            }
                        }
                        else if (parsed.deviceId.startsWith("rinstrum-5000")) {
                            const decodedString = atob(parsed.object.payload);
                            const buffer = new ArrayBuffer(decodedString.length);
                            const arrayView = new Uint8Array(buffer);
                            for (let i = 0; i < decodedString.length; i++) {
                                arrayView[i] = decodedString.charCodeAt(i);
                            }
                            const rbv = new rinstrumBasic_1.RinstrumBasicView({ format: rinstrumBasicFormatSpecifier_2.FormatADefaults, }, arrayView);
                            if (rbv.isValid()) {
                                if (rbv.isStable()) {
                                    stableWeightSeries.push([logEntry.timestamp, rbv.displayedWeightGrams() / 1000]);
                                }
                                else {
                                    unstableWeightSeries.push([logEntry.timestamp, rbv.displayedWeightGrams() / 1000]);
                                }
                            }
                        }
                    }
                    else if (parsed.event == "new_scan") {
                        eidSeries.push([logEntry.timestamp, 1]);
                    }
                }
            }
        }
        const comMessages = logEntryIndicies.file.get("generic_serial.py");
        if (comMessages) {
            for (const logEntry of comMessages) {
                if (logEntry.line == 85) {
                    plcResponseSeries.push([logEntry.timestamp, 1]);
                }
            }
        }
        const data = [];
        let date = [];
        const option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend: {
                type: "plain",
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'time',
                boundaryGap: false
            },
            yAxis: [{
                    min: -100,
                    type: 'value',
                    boundaryGap: [0, '100%']
                }, {
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    min: 0.25,
                    max: 2,
                    type: "value",
                    boundaryGap: [0, '100%']
                }],
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 40
                },
            ],
            series: [
                {
                    barGap: 0,
                    name: 'Stable Weight',
                    type: 'bar',
                    large: true,
                    data: stableWeightSeries,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: "#427DB3",
                    }
                },
                {
                    barGap: 0,
                    name: 'Unstable Weight',
                    type: 'bar',
                    large: true,
                    data: unstableWeightSeries,
                    yAxisIndex: 0,
                    itemStyle: {
                        color: "#FFB700",
                    }
                },
                {
                    barGap: 0,
                    barWidth: "300%",
                    name: 'Crush Reset Notification',
                    type: 'bar',
                    large: true,
                    data: plcResetSeries,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#6a0dad",
                    }
                },
                {
                    barGap: 0,
                    barWidth: "300%",
                    name: 'Draft Decision Requested',
                    type: 'bar',
                    large: true,
                    data: plcDraftRequestSeries,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#F0332D",
                    }
                },
                {
                    barGap: 0,
                    barWidth: "300%",
                    name: 'Draft Decision Made',
                    type: 'bar',
                    large: true,
                    data: plcResponseSeries,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#2A5A05",
                    }
                },
                {
                    barGap: 0,
                    barWidth: "300%",
                    name: 'EID',
                    type: 'bar',
                    large: true,
                    data: eidSeries,
                    yAxisIndex: 1,
                    itemStyle: {
                        color: "#00e7ff",
                    }
                }
            ]
        };
        var chartEl = document.getElementById('chart');
        const chart = echarts.init(chartEl);
        chart.setOption(option);
    }
    exports.indexLogEntries = indexLogEntries;
});
define("src/lib", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUtf8RightSquareBracket = exports.isUtf8LeftSquareBracket = exports.isUtf8Comma = exports.isUtf8Colon = exports.isUtf8Space = exports.isUtf8Hyphen = exports.isUtf8Number = void 0;
    function isUtf8Number(uint) {
        return uint >= 48 && uint <= 57;
    }
    exports.isUtf8Number = isUtf8Number;
    function isUtf8Hyphen(uint) {
        return uint == 45;
    }
    exports.isUtf8Hyphen = isUtf8Hyphen;
    function isUtf8Space(uint) {
        return uint == 32;
    }
    exports.isUtf8Space = isUtf8Space;
    function isUtf8Colon(uint) {
        return uint == 58;
    }
    exports.isUtf8Colon = isUtf8Colon;
    function isUtf8Comma(uint) {
        return uint == 44;
    }
    exports.isUtf8Comma = isUtf8Comma;
    function isUtf8LeftSquareBracket(uint) {
        return uint == 91;
    }
    exports.isUtf8LeftSquareBracket = isUtf8LeftSquareBracket;
    function isUtf8RightSquareBracket(uint) {
        return uint == 93;
    }
    exports.isUtf8RightSquareBracket = isUtf8RightSquareBracket;
});
define("src/parse", ["require", "exports", "src/lib", "src/logEntry"], function (require, exports, lib_1, logEntry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.processTextFileStream = void 0;
    const MAX_PAYLOAD_LENGTH = 16384;
    const MAX_FILE_NAME_LENGTH = 512;
    const MAX_LINE_NUMBER_LENGTH = 10;
    const MAX_PARSE_TICK_TIME = 10;
    var ParseResult;
    (function (ParseResult) {
        ParseResult[ParseResult["SUCCESS"] = 0] = "SUCCESS";
        ParseResult[ParseResult["INVALID_LOG_LEVEL"] = 1] = "INVALID_LOG_LEVEL";
        ParseResult[ParseResult["INVALID_LOG_LEVEL_SUFFIX"] = 2] = "INVALID_LOG_LEVEL_SUFFIX";
        ParseResult[ParseResult["INVALID_TIMESTAMP"] = 3] = "INVALID_TIMESTAMP";
        ParseResult[ParseResult["INVALID_FILE_NAME"] = 4] = "INVALID_FILE_NAME";
        ParseResult[ParseResult["INVALID_LINE_NUMBER"] = 5] = "INVALID_LINE_NUMBER";
        ParseResult[ParseResult["INVALID_PAYLOAD"] = 6] = "INVALID_PAYLOAD";
    })(ParseResult || (ParseResult = {}));
    ;
    const LogLevelStringPrefixMap = {
        "ERROR:": logEntry_1.LogLevel.ERROR,
        "WARNIN": logEntry_1.LogLevel.WARN,
        "INFO: ": logEntry_1.LogLevel.INFO,
        "DEBUG:": logEntry_1.LogLevel.DEBUG,
    };
    const LogLevelStringSuffixMap = {
        [logEntry_1.LogLevel.ERROR]: " ",
        [logEntry_1.LogLevel.WARN]: "G: ",
        [logEntry_1.LogLevel.INFO]: "",
        [logEntry_1.LogLevel.DEBUG]: " ",
    };
    const LogLevelOffset = [
        7,
        9,
        6,
        7
    ];
    const LogLevelPrefixSize = 6;
    const TimeStampOffset = 23;
    const timestampNumberIndices = [0, 1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 22];
    const timestampHyphenIndices = [4, 7];
    const timestampSpaceIndices = [10];
    const timestampColonIndices = [13, 16];
    const timestampCommaIndices = [19];
    const timestampIndexChecks = [
        [timestampNumberIndices, lib_1.isUtf8Number],
        [timestampHyphenIndices, lib_1.isUtf8Hyphen],
        [timestampSpaceIndices, lib_1.isUtf8Space],
        [timestampColonIndices, lib_1.isUtf8Colon],
        [timestampCommaIndices, lib_1.isUtf8Comma],
    ];
    var ParseState = {
        START: 0,
        LOG_LEVEL: 1,
        TIME_STAMP: 2,
        PRE_FILE_NAME: 3,
        FILE_NAME_OPEN: 4,
        FILE_NAME: 5,
        FILE_NAME_LINE_NUMBER_SEP: 6,
        LINE_NUMBER: 7,
        LINE_NUMBER_CLOSE: 8,
        PRE_PAYLOAD_SEP: 9,
        PRE_PAYLOAD: 10,
        PAYLOAD: 11,
        PAYLOAD_CONTINUED: 12,
        LOG_ENTRY_COMPLETE: 13,
        ERROR: 14,
    };
    class ParseInfo {
        parseState = ParseState.START;
        dataView;
        logEntries = [];
        lineCount = 0;
        errorLines = 0;
        logEntry;
        offset = 0;
        constructor(dataView, logEntry) {
            this.dataView = dataView;
            this.logEntry = logEntry;
        }
    }
    const utf8Decoder = new TextDecoder();
    function validateTimestamp(dataView, offset) {
        for (var indexCheck of timestampIndexChecks) {
            const indexTestFn = indexCheck[1];
            for (var index of indexCheck[0]) {
                if (!indexTestFn(dataView.getUint8(index + offset))) {
                    return false;
                }
            }
        }
        return true;
    }
    function getTimestamp(dataView, offset, logEntry) {
        if (!validateTimestamp(dataView, offset)) {
            return ParseResult.INVALID_TIMESTAMP;
        }
        var year, month, day, hour, minute, second, millis;
        year = ((dataView.getUint8(offset) - 48) * 1000 +
            (dataView.getUint8(offset + 1) - 48) * 100 +
            (dataView.getUint8(offset + 2) - 48) * 10 +
            dataView.getUint8(offset + 3) - 48);
        month = ((dataView.getUint8(offset + 5) - 48) * 10 +
            dataView.getUint8(offset + 6) - 48);
        day = ((dataView.getUint8(offset + 8) - 48) * 10 +
            dataView.getUint8(offset + 9) - 48);
        hour = ((dataView.getUint8(offset + 11) - 48) * 10 +
            dataView.getUint8(offset + 12) - 48);
        minute = ((dataView.getUint8(offset + 14) - 48) * 10 +
            dataView.getUint8(offset + 15) - 48);
        second = ((dataView.getUint8(offset + 17) - 48) * 10 +
            dataView.getUint8(offset + 18) - 48);
        millis = ((dataView.getUint8(offset + 20) - 48) * 100 +
            (dataView.getUint8(offset + 21) - 48) * 10 +
            dataView.getUint8(offset + 22) - 48);
        logEntry.timestamp = new Date(year, month - 1, day, hour, minute, second, millis);
        return ParseResult.SUCCESS;
    }
    function getLogLevel(dataView, offset, logEntry) {
        var prefix = String.fromCharCode(dataView.getUint8(offset), dataView.getUint8(offset + 1), dataView.getUint8(offset + 2), dataView.getUint8(offset + 3), dataView.getUint8(offset + 4), dataView.getUint8(offset + 5));
        var preliminaryLogLevel = LogLevelStringPrefixMap[prefix];
        if (typeof preliminaryLogLevel !== "number") {
            return ParseResult.INVALID_LOG_LEVEL;
        }
        var trailingChars = LogLevelStringSuffixMap[preliminaryLogLevel];
        for (var i = 0; i < trailingChars.length; i++) {
            var charCode = trailingChars.charCodeAt(i);
            if (dataView.getUint8(offset + i + LogLevelPrefixSize) != charCode) {
                return ParseResult.INVALID_LOG_LEVEL;
            }
        }
        logEntry.level = preliminaryLogLevel;
        return ParseResult.SUCCESS;
    }
    function getFileName(dataView, offset, logEntry) {
        var nameLength = 0;
        for (; nameLength < dataView.byteLength - offset; nameLength++) {
            if (nameLength >= MAX_FILE_NAME_LENGTH) {
                return ParseResult.INVALID_FILE_NAME;
            }
            var c = dataView.getUint8(offset + nameLength);
            if (c == 0x0A || (0, lib_1.isUtf8LeftSquareBracket)(c)) {
                return ParseResult.INVALID_FILE_NAME;
            }
            if ((0, lib_1.isUtf8Colon)(c)) {
                break;
            }
        }
        logEntry.file = utf8Decoder.decode(new Uint8Array(dataView.buffer, offset, nameLength));
        return ParseResult.SUCCESS;
    }
    function getLineNumber(dataView, offset, logEntry) {
        var numberLength = 0;
        for (; numberLength < dataView.byteLength - offset; numberLength++) {
            if (numberLength >= MAX_LINE_NUMBER_LENGTH) {
                return ParseResult.INVALID_LINE_NUMBER;
            }
            var c = dataView.getUint8(offset + numberLength);
            if ((0, lib_1.isUtf8Number)(c)) {
                continue;
            }
            if ((0, lib_1.isUtf8RightSquareBracket)(c)) {
                break;
            }
            return ParseResult.INVALID_LINE_NUMBER;
            ;
        }
        for (var i = 0; numberLength; numberLength--, i++) {
            logEntry.line += (dataView.getUint8(offset + i) - 48) * Math.pow(10, numberLength - 1);
        }
        return ParseResult.SUCCESS;
    }
    function getPayload(dataView, offset, logEntry) {
        var payloadLength = 0;
        for (; payloadLength < dataView.byteLength - offset; payloadLength++) {
            if (payloadLength >= MAX_PAYLOAD_LENGTH) {
                return ParseResult.INVALID_PAYLOAD;
            }
            var c = dataView.getUint8(offset + payloadLength);
            if (c == 0x0A) {
                var nextLineOffset = offset + payloadLength + 1;
                if (nextLineOffset >= dataView.byteLength ||
                    getLogLevel(dataView, nextLineOffset, new logEntry_1.LogEntry()) == ParseResult.SUCCESS) {
                    payloadLength--;
                    break;
                }
            }
        }
        logEntry.payload = new Uint8Array(dataView.buffer, offset, payloadLength);
        return ParseResult.SUCCESS;
    }
    function processFileStreamTick(parseInfo, onProgress, onError) {
        while (parseInfo.offset < parseInfo.dataView.byteLength) {
            var c0 = parseInfo.dataView.getUint8(parseInfo.offset);
            if (c0 == 0x0A) {
                parseInfo.lineCount++;
            }
            switch (parseInfo.parseState) {
                case ParseState.START:
                    parseInfo.logEntry = new logEntry_1.LogEntry();
                    var parseResult = getLogLevel(parseInfo.dataView, parseInfo.offset, parseInfo.logEntry);
                    if (parseResult !== ParseResult.SUCCESS) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.offset++;
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.offset += LogLevelOffset[parseInfo.logEntry.level];
                        parseInfo.parseState = ParseState.TIME_STAMP;
                    }
                    break;
                case ParseState.TIME_STAMP:
                    var parseResult = getTimestamp(parseInfo.dataView, parseInfo.offset, parseInfo.logEntry);
                    if (parseResult !== ParseResult.SUCCESS) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.offset += 23;
                        parseInfo.parseState = ParseState.PRE_FILE_NAME;
                    }
                    break;
                case ParseState.PRE_FILE_NAME:
                    if (!(0, lib_1.isUtf8Space)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.FILE_NAME_OPEN;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.FILE_NAME_OPEN:
                    if (!(0, lib_1.isUtf8LeftSquareBracket)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.FILE_NAME;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.FILE_NAME:
                    var parseResult = getFileName(parseInfo.dataView, parseInfo.offset, parseInfo.logEntry);
                    if (parseResult !== ParseResult.SUCCESS) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.offset += parseInfo.logEntry.file.length;
                        parseInfo.parseState = ParseState.FILE_NAME_LINE_NUMBER_SEP;
                    }
                    break;
                case ParseState.FILE_NAME_LINE_NUMBER_SEP:
                    if (!(0, lib_1.isUtf8Colon)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.LINE_NUMBER;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.LINE_NUMBER:
                    var parseResult = getLineNumber(parseInfo.dataView, parseInfo.offset, parseInfo.logEntry);
                    if (parseResult !== ParseResult.SUCCESS) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.offset += Math.ceil(Math.log10(parseInfo.logEntry.line + 1));
                        parseInfo.parseState = ParseState.LINE_NUMBER_CLOSE;
                    }
                    break;
                case ParseState.LINE_NUMBER_CLOSE:
                    if (!(0, lib_1.isUtf8RightSquareBracket)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.PRE_PAYLOAD_SEP;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.PRE_PAYLOAD_SEP:
                    if (!(0, lib_1.isUtf8Colon)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.PRE_PAYLOAD;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.PRE_PAYLOAD:
                    if (!(0, lib_1.isUtf8Space)(c0)) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.parseState = ParseState.PAYLOAD;
                        parseInfo.offset++;
                    }
                    break;
                case ParseState.PAYLOAD:
                    var parseResult = getPayload(parseInfo.dataView, parseInfo.offset, parseInfo.logEntry);
                    if (parseResult !== ParseResult.SUCCESS) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.parseState = ParseState.ERROR;
                    }
                    else {
                        parseInfo.offset += parseInfo.logEntry.payload.byteLength + 1;
                        parseInfo.parseState = ParseState.LOG_ENTRY_COMPLETE;
                    }
                    break;
                case ParseState.LOG_ENTRY_COMPLETE:
                    parseInfo.parseState = ParseState.START;
                    parseInfo.logEntries.push(parseInfo.logEntry);
                    onProgress(parseInfo.offset / parseInfo.dataView.byteLength);
                    parseInfo.offset++;
                    return;
                    break;
                case ParseState.ERROR:
                    if (c0 == 0x0A) {
                        onError(parseInfo.lineCount, parseInfo.offset);
                        parseInfo.errorLines++;
                        parseInfo.parseState = ParseState.START;
                    }
                    parseInfo.offset++;
                    break;
                default:
                    onError(parseInfo.lineCount, parseInfo.offset);
                    break;
            }
        }
    }
    function processTextFileStream(arrayBuffer, onProgress, onComplete, onError) {
        var parseInfo = new ParseInfo(new DataView(arrayBuffer), new logEntry_1.LogEntry());
        function nextTick() {
            var tickStart = Date.now();
            var tickEnd = tickStart;
            do {
                processFileStreamTick(parseInfo, onProgress, onError);
                tickEnd = Date.now();
            } while (tickEnd - tickStart < MAX_PARSE_TICK_TIME && parseInfo.offset < parseInfo.dataView.byteLength);
            if (parseInfo.offset < parseInfo.dataView.byteLength) {
                setTimeout(nextTick, 0);
            }
            else {
                onComplete(parseInfo.logEntries);
            }
        }
        nextTick();
    }
    exports.processTextFileStream = processTextFileStream;
});
define("src/index", ["require", "exports", "src/indexes", "src/parse"], function (require, exports, indexes_1, parse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init(fileInputEl, fileProcessingProgessEl) {
        if (!fileProcessingProgessEl || !fileInputEl) {
            return;
        }
        function onLoadReader(progressEvent) {
            (0, parse_1.processTextFileStream)(progressEvent.target.result, (progress) => fileProcessingProgessEl.value = progress * 100, indexes_1.indexLogEntries, (lineNumber, byeOffset) => {
                fileProcessingProgessEl.value = 0;
                console.warn(`Error on line ${lineNumber} ${byeOffset}`);
            });
        }
        function onChangeFileInput(ev) {
            const { files } = ev.target;
            if (!files) {
                return;
            }
            fileProcessingProgessEl.value = 0;
            if (files.length > 0) {
                var reader = new FileReader();
                reader.addEventListener("load", onLoadReader);
                for (const file of files) {
                    if (true || file.type == "text/plain") {
                        reader.readAsArrayBuffer(file);
                        // fileBytes.push( window.bz2.decompress() );
                    }
                }
            }
        }
        fileInputEl?.addEventListener("change", onChangeFileInput);
    }
    init(document.getElementById("file"), document.getElementById("file-processing-progress"));
});
define("src/sessions", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function extractSessions(logEntries) {
        // First thing is to sort the log entries by their date;
        logEntries.sort((aLogEntry, bLogEntry) => bLogEntry.timestamp.valueOf() - aLogEntry.timestamp.valueOf());
    }
});
