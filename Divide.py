import sys, math

def solve_relic(relicH, relicM, relicL):
    
    if(relicH > 51):
        defaultH = relicH / 51
    else:
        defaultH = 0

    if(relicM > 52):
        defaultM = relicH / 52
    else:
        defaultM = 0

    if(relicL > 107):
        defaultL = relicL / 107
    else:
        defaultL = 0

    remain = math.floor(min(defaultH, defaultM, defaultL))
    print(remain)

    targetH = relicH - (remain * 51)
    targetM = relicM - (remain * 52)
    targetL = relicL - (remain * 107)
    print(targetH , targetM, targetL)

    sizeM = math.floor(targetM / 50)
    sizeL = math.floor(targetL / 100)
    cost = [[0 for j in range(sizeM)] for i in range(sizeL)]
    print(cost)

    for i in range(sizeM):
        for j in range(sizeL):
            powder = 0
            powder += (i * 50)
    
if __name__ == "__main__":

    if len(sys.argv) == 4:
        solve_relic(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]))