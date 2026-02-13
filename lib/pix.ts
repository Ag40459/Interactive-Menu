// lib/pix.ts
function tlv(id: string, value: string) {
    const len = value.length.toString().padStart(2, "0");
    return `${id}${len}${value}`;
}

// CRC16/CCITT-FALSE
function crc16(payload: string) {
    let crc = 0xffff;
    const poly = 0x1021;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ poly) & 0xffff : (crc << 1) & 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
}

function asciiClean(s: string, max: number) {
    const noAccents = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return noAccents.toUpperCase().replace(/[^A-Z0-9 ]/g, "").slice(0, max);
}

export type PixParams = { key: string; amount: number; name: string; city: string; txid?: string; };

export function buildPixPayload({ key, amount, name, city, txid = "PEDIDO" }: PixParams) {
    const cleanKey = key.replace(/\s|\.|-/g, "");
    const nm = asciiClean(name || "LOJA", 25);
    const ct = asciiClean(city || "RECIFE", 15);
    const tx = asciiClean(txid, 25);

    // 26 = "br.gov.bcb.pix" (sub00) + chave (sub01)  ← **ESSENCIAL**
    const mai = tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", cleanKey));

    const payloadNoCRC =
        tlv("00", "01") +          // format
        tlv("01", "11") +          // estático
        mai +                      // merchant info (26)
        tlv("52", "0000") +        // MCC
        tlv("53", "986") +         // BRL
        tlv("54", amount.toFixed(2)) + // valor
        tlv("58", "BR") +          // país
        tlv("59", nm) +            // nome recebedor
        tlv("60", ct) +            // cidade
        tlv("62", tlv("05", tx)) + // TXID
        "6304";                    // placeholder CRC

    const crc = crc16(payloadNoCRC);
    return payloadNoCRC + crc;
}