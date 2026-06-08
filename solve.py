def decryptPassword(s):
    # Collect leading digits (last digit processed appears first in encrypted)
    i = 0
    leading = []
    while i < len(s) and s[i].isdigit() and s[i] != '0':
        leading.append(s[i])
        i += 1

    # Process the rest, reversing encryption
    out = []
    body = s[i:]
    i = 0
    n = len(body)

    while i < n:
        c = body[i]

        # Reverse swap: encrypted has Upper+lower+* → original has lower+Upper
        if (c.isupper() and i + 2 < n and body[i+1].islower() and body[i+2] == '*'):
            out.append(body[i+1])
            out.append(c)
            i += 3
        # Reverse digit: 0 placeholder → pop from leading digits
        elif c == '0' and leading:
            out.append(leading.pop())
            i += 1
        else:
            # Literal 0 (or any other char)
            if c != '*':
                out.append(c)
            i += 1

    return ''.join(out)
