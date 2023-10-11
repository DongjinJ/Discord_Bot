import sys, math

def solve_relic(relicH, relicM, relicL):
    
    remain = min_relic(relicH, relicM, relicL)
    print(f'입력 유물 재료')
    print(f'오래하 유물: {relicH} / 희귀한 유물: {relicM} / 고대 유물: {relicL}')
    print(f'현재 만들 수 있는 최상급 상래하: {remain}개')

    targetH = relicH - (remain * 51)
    targetM = relicM - (remain * 52)
    targetL = relicL - (remain * 107)
    print(f'남은 유물 재료')
    print(f'오래하 유물: {targetH} / 희귀한 유물: {targetM} / 고대 유물: {targetL}')

    sizeM = math.floor(targetM / 50)
    sizeL = math.floor(targetL / 100)
 
    maxMIndex = 0
    maxLIndex = 0
    maxPowder = 0
    finalH = 0
    finalM = 0
    finalL = 0
    cost = 0
    for j in range(sizeM):
        for i in range(sizeL):
            powder = 0
            powder += (j * 80)
            tempM = targetM - (j * 50)
            powder += (i * 80)
            tempL = targetL - (i * 100)
            tempH = targetH + (powder / 10)

            tempCost = min_relic(tempH, tempM, tempL)
            if cost == 0:
                cost = tempCost
                maxMIndex = j
                maxLIndex = i
                maxPowder = powder
                finalH = tempH
                finalM = tempM
                finalL = tempL
            else:
                if tempCost > cost:
                    cost = tempCost
                    maxMIndex = j
                    maxLIndex = i
                    maxPowder = powder
                    finalH = tempH
                    finalM = tempM
                    finalL = tempL
    print(f'희귀한 유물 -> 고고학 가루: {maxMIndex}개 ({maxMIndex * 50})')
    print(f'고대 유물 -> 고고학 가루: {maxLIndex}개 ({maxLIndex * 100})')
    print(f'고고학 가루 -> 오래하 유물: {maxPowder}개 ({maxPowder / 10})')
    print(f'변환 후 유물 재료')
    print(f'오래하 유물: {finalH} / 희귀한 유물: {finalM} / 고대 유물: {finalL}')
    print(f'현재 만들 수 있는 최상급 상래하: {cost}개')

def min_relic(valueH, valueM, valueL):
    if(valueH > 51):
        defaultH = valueH / 51
    else:
        defaultH = 0

    if(valueM > 52):
        defaultM = valueM / 52
    else:
        defaultM = 0

    if(valueL > 107):
        defaultL = valueL / 107
    else:
        defaultL = 0

    remain = math.floor(min(defaultH, defaultM, defaultL))

    return remain

if __name__ == "__main__":

    if len(sys.argv) == 4:
        solve_relic(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]))