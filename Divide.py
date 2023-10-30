import sys, math

RARE_RELIC = 52
ADVANCED_RELIC = 51
NORMAL_RELIC = 107
def solve_relic(relicH, relicM, relicL, defaultPowder):
    
    remain = min_relic(relicH, relicM, relicL)
    # print(f'입력 유물 재료')
    # print(f'오래하 유물: {relicH} / 희귀한 유물: {relicM} / 고대 유물: {relicL}')
    # print(f'현재 만들 수 있는 최상급 상래하: {remain}개')

    targetH = relicH - (remain * RARE_RELIC)
    targetM = relicM - (remain * ADVANCED_RELIC)
    targetL = relicL - (remain * NORMAL_RELIC)
    # print(f'남은 유물 재료')
    # print(f'오래하 유물: {targetH} / 희귀한 유물: {targetM} / 고대 유물: {targetL}')

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
            powder = defaultPowder
            powder += (j * 80)
            tempM = targetM - (j * 50)
            powder += (i * 80)
            tempL = targetL - (i * 100)
            tempH = targetH + (powder / 100) * 10

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
                    # print(f'{tempH} {tempM} {tempL} {tempCost}')
    # print(f'오래하 유물: {targetH} / 희귀한 유물: {targetM} / 고대 유물: {targetL}')
    # print(f'희귀한 유물 -> 고고학 가루: {maxMIndex}개 ({maxMIndex * 50})')
    # print(f'고대 유물 -> 고고학 가루: {maxLIndex}개 ({maxLIndex * 100})')
    # print(f'고고학 가루 -> 오래하 유물: {maxPowder}개 ({maxPowder / 10})')
    # print(f'변환 후 유물 재료')
    # print(f'오래하 유물: {finalH} / 희귀한 유물: {finalM} / 고대 유물: {finalL}')
    # print(f'현재 만들 수 있는 최상급 상래하: {cost}개')
    print(f'{targetH} {targetM} {targetL} {maxMIndex} {maxLIndex} {maxPowder} {finalH} {finalM} {finalL} {cost+remain}')

def min_relic(valueH, valueM, valueL):
    if(valueH > RARE_RELIC):
        defaultH = valueH / RARE_RELIC
    else:
        defaultH = 0

    if(valueM > ADVANCED_RELIC):
        defaultM = valueM / ADVANCED_RELIC
    else:
        defaultM = 0

    if(valueL > NORMAL_RELIC):
        defaultL = valueL / NORMAL_RELIC
    else:
        defaultL = 0

    remain = math.floor(min(defaultH, defaultM, defaultL))
    

    return remain

if __name__ == "__main__":

    if len(sys.argv) == 5:
        solve_relic(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]))