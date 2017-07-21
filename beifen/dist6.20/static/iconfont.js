;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-erweima" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M152.075264 123.511808c101.716992 0 203.435008 0 305.152 0 31.031296 3.073024 23.552 57.696256 23.552 93.184 0 63.742976 0 105.755648 0 168.96 0 36.721664 6.915072 81.729536-17.408 92.16-15.840256 6.793216-58.351616 2.048-78.848 2.048-56.271872 0-102.012928 0-161.792 0-37.400576 0-88.469504 8.927232-94.208-23.552 0-103.083008 0-206.164992 0-309.248C132.70528 135.544832 140.061696 127.200256 152.075264 123.511808zM194.059264 193.143808c0 73.387008 0 146.772992 0 220.16 73.387008 0 146.772992 0 220.16 0 0-74.411008 0-148.820992 0-223.232-73.044992 0-146.091008 0-219.136 0C193.890304 190.24384 193.9712 191.690752 194.059264 193.143808z"  ></path>' +
    '' +
    '<path d="M561.675264 123.511808c101.716992 0 203.435008 0 305.152 0 12.447744 4.61824 21.001216 13.1328 23.552 27.648 0 100.352 0 200.705024 0 301.056-2.792448 12.510208-9.324544 23.196672-21.504 26.624-19.904512 5.600256-52.977664 1.024-76.8 1.024-56.127488 0-102.14912 0-156.672 0-23.626752 0-58.642432 4.97664-77.824-1.024-27.077632-8.471552-19.456-61.329408-19.456-98.304 0-49.115136 0-106.445824 0-157.696C538.123264 180.148224 528.75264 129.476608 561.675264 123.511808zM603.659264 193.143808c0 73.387008 0 146.772992 0 220.16 73.387008 0 146.772992 0 220.16 0 0-74.411008 0-148.820992 0-223.232-73.044992 0-146.091008 0-219.136 0C603.490304 190.24384 603.5712 191.690752 603.659264 193.143808z"  ></path>' +
    '' +
    '<path d="M294.411264 257.655808c30.661632-5.786624 54.774784 14.930944 55.296 43.008 0.687104 37.025792-37.129216 57.365504-66.56 41.984C249.47712 325.050368 251.693056 265.71776 294.411264 257.655808z"  ></path>' +
    '' +
    '<path d="M704.011264 257.655808c72.223744-13.493248 70.839296 100.886528 0 89.088C658.929664 339.23584 657.47456 266.350592 704.011264 257.655808z"  ></path>' +
    '' +
    '<path d="M455.179264 895.607808c-100.692992 0-201.385984 0-302.08 0-12.540928-3.843072-21.01248-11.75552-24.576-24.576 0-102.740992 0-205.483008 0-308.224 2.982912-9.019392 9.868288-19.542016 20.48-22.528 20.0448-5.640192 52.7872-1.024 76.8-1.024 55.189504 0 105.184256 0 156.672 0 23.154688 0 56.85248-5.168128 77.824 1.024 28.371968 8.37632 20.48 60.376064 20.48 97.28 0 56.7296 0 105.121792 0 162.816C480.779264 840.206336 489.356288 892.051456 455.179264 895.607808zM194.059264 608.887808c0 73.388032 0 146.772992 0 220.16 73.387008 0 146.772992 0 220.16 0 0-74.411008 0-148.820992 0-223.232-73.044992 0-146.091008 0-219.136 0C193.890304 605.98784 193.9712 607.434752 194.059264 608.887808z"  ></path>' +
    '' +
    '<path d="M890.379264 566.903808c0 28.672 0 57.344 0 86.016-2.388992 29.014016-0.342016 62.462976-1.024 93.184-72.704 0-145.408 0-218.112 0 0-16.724992 0-33.451008 0-50.176-20.481024-2.387968-45.395968-0.342016-67.584-1.024-2.388992 64.854016-0.340992 134.142976-1.024 200.704-13.312 0-26.624 0-39.936 0-34.337792-6.882304-24.576-58.407936-24.576-99.328 0-57.078784 0-104.042496 0-158.72 0-23.865344-4.830208-59.64288 1.024-78.848 6.984704-22.913024 37.274624-19.456 67.584-19.456 51.24096 0 96.891904 0 148.48 0 0 45.396992 0 90.795008 0 136.192 22.868992 0 45.739008 0 68.608 0 0.681984-45.056-1.364992-92.841984 1.024-136.192C857.858048 537.302016 888.439808 537.783296 890.379264 566.903808z"  ></path>' +
    '' +
    '<path d="M299.531264 672.375808c32.740352-3.623936 59.804672 27.841536 47.104 62.464-17.604608 47.98976-101.778432 29.953024-86.016-30.72C264.976384 687.348736 277.561344 674.807808 299.531264 672.375808z"  ></path>' +
    '' +
    '<path d="M744.971264 895.607808c-24.576 0-49.152 0-73.728 0 0.681984-26.284032-1.363968-55.294976 1.024-79.872 24.235008 0 48.468992 0 72.704 0C744.971264 842.359808 744.971264 868.983808 744.971264 895.607808z"  ></path>' +
    '' +
    '<path d="M890.379264 815.735808c0 17.408 0 34.816 0 52.224-2.84672 14.56128-11.36128 23.45472-24.576 27.648-17.408 0-34.816 0-52.224 0 0.681984-26.284032-1.363968-55.294976 1.024-79.872C839.862272 815.735808 865.120256 815.735808 890.379264 815.735808z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-shijian" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.700671 127.718847c-211.957911 0-383.778061 171.815157-383.778061 383.76336 0 211.95025 171.821174 383.76336 383.778061 383.76336 211.957911 0 383.780108-171.813111 383.780108-383.76336C895.480779 299.534004 723.658581 127.718847 511.700671 127.718847zM511.700671 860.359013c-192.690312 0-348.890077-156.209738-348.890077-348.875782 0-192.699814 156.199765-348.875782 348.890077-348.875782 192.691336 0 348.8911 156.176992 348.8911 348.875782C860.591771 704.147228 704.392006 860.359013 511.700671 860.359013zM703.591748 511.48323 529.145686 511.48323 529.145686 284.71346c0-9.641591-7.819403-17.443277-17.445016-17.443277-9.624589 0-17.443992 7.801686-17.443992 17.443277l0 244.213048c0 9.625218 7.819403 17.443277 17.443992 17.443277l191.891077 0c9.624589 0 17.445016-7.819083 17.445016-17.443277C721.033694 519.28594 713.216337 511.48323 703.591748 511.48323z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-shezhi" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M511.994372 697.339172c-101.688057 0-184.408356-82.862219-184.408356-184.710862 0-101.847619 82.720299-184.701652 184.408356-184.701652s184.417566 82.85301 184.417566 184.701652C696.411938 614.477976 613.682428 697.339172 511.994372 697.339172zM511.994372 388.822586c-68.157032 0-123.61022 55.543014-123.61022 123.805724 0 68.272943 55.453188 123.815957 123.61022 123.815957 68.166242 0 123.620454-55.543014 123.620454-123.815957C635.614825 444.3656 580.160614 388.822586 511.994372 388.822586z"  ></path>' +
    '' +
    '<path d="M581.629118 126.045741l0 40.661072c0 29.854958 17.801141 56.518225 45.331252 67.944462 8.955319 3.720741 18.401846 5.598508 28.096023 5.598508 19.615537 0 38.055247-7.650237 51.915474-21.538549l26.02579-26.061562 98.469627 98.629321-26.016579 26.061562c-21.074831 21.109784-27.321348 52.570309-15.913063 80.145341 11.399075 27.584242 38.026593 45.402049 67.827514 45.402049l39.339549 0 0 139.490961-39.339549 0c-29.800921 0-56.429462 17.817808-67.827514 45.39284-11.408285 27.584242-5.161768 59.043744 15.913063 80.153528l26.016579 26.062586-98.469627 98.629321-26.02579-26.062586c-13.86125-13.887288-32.299937-21.538549-51.915474-21.538549-9.694177 0-19.140703 1.87879-28.096023 5.599532-27.530111 11.416004-45.331252 38.089503-45.331252 67.943438l0 39.393195L442.369858 897.952212l0-39.393195c0-29.854958-17.791931-56.527434-45.322042-67.943438-8.955319-3.720741-18.41208-5.599532-28.106256-5.599532-19.605303 0-38.054223 7.65126-51.91445 21.538549l-26.026813 26.062586-98.469627-98.629321 26.017603-26.062586c21.074831-21.109784 27.320325-52.569286 15.913063-80.144318-11.399075-27.584242-38.026593-45.402049-67.828537-45.402049l-39.331362 0L127.301437 442.887946l39.331362 0c29.801944 0 56.430486-17.817808 67.828537-45.402049 11.407262-27.575032 5.161768-59.034535-15.913063-80.145341l-26.017603-26.061562 98.469627-98.629321 26.026813 26.061562c13.86125 13.888312 32.309147 21.538549 51.91445 21.538549 9.694177 0 19.141727-1.877767 28.096023-5.598508 27.540345-11.426237 45.332275-38.089503 45.332275-67.944462l0-40.661072L581.629118 126.045741M581.629118 65.150836 442.369858 65.150836c-33.44097 0-60.798136 31.204699-60.798136 64.697511l0 36.858466c0 5.124717-3.082325 9.729595-7.796889 11.69025-1.558559 0.64673-3.20001 0.957815-4.833273 0.957815-3.282901 0-6.510541-1.277086-8.927689-3.702322l-26.026813-26.061562c-11.818648-11.845793-27.402193-17.763572-42.987785-17.763572s-31.159927 5.91778-42.987785 17.763572l-98.477814 98.629321c-23.637295 23.681352-23.637295 62.445214 0 86.11838l26.026813 26.061562c3.610372 3.619434 4.686934 9.063423 2.73541 13.788028-1.951525 4.722558-6.556591 7.80578-11.663099 7.80578l-36.804715 0c-33.430737 0-63.323759 27.40107-63.323759 60.894905l0 139.490961c0 33.492812 29.893022 60.894905 63.323759 60.894905l36.804715 0c5.106507 0 9.711574 3.082198 11.663099 7.80578s0.874963 10.168594-2.73541 13.788028l-26.026813 26.062586c-23.637295 23.681352-23.637295 62.436004 0 86.117356l98.477814 98.629321c11.827858 11.835559 27.402193 17.763572 42.987785 17.763572s31.169137-5.928013 42.987785-17.763572l26.026813-26.061562c2.416125-2.416026 5.644788-3.702322 8.927689-3.702322 1.633264 0 3.273691 0.310062 4.833273 0.957815 4.714565 1.960655 7.796889 6.574742 7.796889 11.69025l0 36.859489c0 33.484625 27.357165 63.429635 60.798136 63.429635l139.25926 0c33.439947 0 60.797112-29.946033 60.797112-63.429635l0-36.859489c0-5.115508 3.073114-9.729595 7.796889-11.69025 1.558559-0.647753 3.201033-0.957815 4.833273-0.957815 3.282901 0 6.510541 1.286296 8.927689 3.702322l26.017603 26.061562c11.827858 11.835559 27.412426 17.763572 42.996995 17.763572 15.576382 0 31.170161-5.928013 42.988808-17.763572l98.477814-98.629321c23.637295-23.682375 23.637295-62.437028 0-86.117356l-26.026813-26.062586c-3.611396-3.619434-4.686934-9.063423-2.736433-13.788028 1.951525-4.723581 6.556591-7.80578 11.663099-7.80578l36.805739 0c33.430737 0 63.323759-27.40107 63.323759-60.894905L957.494652 442.887946c0-33.492812-29.893022-60.894905-63.323759-60.894905l-36.805739 0c-5.106507 0-9.711574-3.083222-11.663099-7.80578-1.950502-4.723581-0.874963-10.168594 2.736433-13.788028l26.026813-26.061562c23.637295-23.672142 23.637295-62.437028 0-86.11838l-98.477814-98.629321c-11.818648-11.845793-27.412426-17.763572-42.988808-17.763572-15.584569 0-31.169137 5.91778-42.996995 17.763572l-26.017603 26.061562c-2.416125 2.426259-5.644788 3.702322-8.927689 3.702322-1.63224 0-3.273691-0.310062-4.833273-0.957815-4.723775-1.960655-7.796889-6.565533-7.796889-11.69025l0-36.858466C642.42623 96.354512 615.069065 65.150836 581.629118 65.150836L581.629118 65.150836z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-yanjing" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1891.149229 2913.352747c0 0-5.284575 24.762987-22.513681 34.792411 0 0 34.697676 0.312108 50.144108-27.629267"  ></path>' +
    '' +
    '<path d="M508.30571 211.635071c-208.000831 0-388.285275 121.147174-476.862284 298.025651C120.021458 686.568874 300.304878 807.687396 508.30571 807.687396S896.561307 686.568874 985.167993 509.660722C896.590984 332.782246 716.307564 211.635071 508.30571 211.635071M743.428364 369.677551c56.031436 35.732829 103.508696 83.626629 139.183671 139.983171-35.674975 56.356542-83.153259 104.249319-139.183671 140.012847-70.397211 44.912909-151.701278 68.605517-235.122654 68.605517s-164.726466-23.692608-235.122654-68.605517c-56.031436-35.763528-103.508696-83.656305-139.183671-140.012847 35.674975-56.326866 83.153259-104.249319 139.183671-139.983171 3.63596-2.324952 7.331273-4.559852 11.057288-6.765077-9.299174 25.421996-14.365775 52.899814-14.365775 81.569784 0 131.697461 106.75783 238.421134 238.431142 238.421134s238.431142-106.72265 238.431142-238.421134c0-28.66997-5.066602-56.118112-14.336098-81.540108C736.09709 365.118722 739.792404 367.353622 743.428364 369.677551M508.30571 414.679487c0 49.382711-40.026255 89.408309-89.412062 89.408309s-89.412062-40.024575-89.412062-89.408309c0-49.353035 40.026255-89.408309 89.412062-89.408309S508.30571 365.326453 508.30571 414.679487"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiantou" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M767.707334 519.450692 308.065819 71.476915 256.054235 122.209366 663.627884 519.419993 256.085958 916.629597 308.060703 967.363072Z" fill="#bfbfbf" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiahao" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M475.428571 475.428571 36.444709 475.428571C16.08459 475.428571 0 491.802149 0 512 0 532.338651 16.316855 548.571429 36.444709 548.571429L475.428571 548.571429 475.428571 987.555291C475.428571 1007.91541 491.802149 1024 512 1024 532.338651 1024 548.571429 1007.683145 548.571429 987.555291L548.571429 548.571429 987.555291 548.571429C1007.91541 548.571429 1024 532.197851 1024 512 1024 491.661349 1007.683145 475.428571 987.555291 475.428571L548.571429 475.428571 548.571429 36.444709C548.571429 16.08459 532.197851 0 512 0 491.661349 0 475.428571 16.316855 475.428571 36.444709L475.428571 475.428571Z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-arrowDown" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M527.929 750.768l438.277-431.027c6.798-6.686 6.891-17.619 0.203-24.42-6.686-6.801-17.62-6.891-24.42-0.203l-426.067 419.018-424.478-424.477c-6.743-6.743-17.677-6.743-24.42 0-3.372 3.372-5.058 7.792-5.058 12.211s1.687 8.84 5.058 12.211l436.584 436.584c6.705 6.705 17.56 6.75 24.32 0.102z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiantou-copy-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M238.978 454.188c150.177-145.192 300.353-290.378 450.526-435.422 61.836-59.842 154.021 37.327 91.899 97.313-133.647 129.23-267.296 258.318-400.868 387.548 134.287 133.646 268.574 267.436 402.934 401.083 61.123 60.84-31.060 158.011-91.971 97.244-150.89-150.105-301.703-300.279-452.521-450.454-24.934-24.933-25.575-72.666 0-97.311z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-dianzan" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253" fill="#d93639" ></path>' +
    '' +
    '<path d="M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819" fill="#d93639" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-iconfonti2-copy-copy-copy-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M942.936 747.245c29.315-28.497 29.315-74.739 0-103.307l-378.011-367.236c-29.367-28.483-76.982-28.483-106.291 0l-377.997 367.236c-29.367 28.562-29.367 74.806 0 103.307 29.325 28.546 76.929 28.546 106.304 0l324.841-315.6 324.803 315.599c29.367 28.545 76.973 28.544 106.356 0v0z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-weibiaoti101" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M596.232 932.619h-168.488c-158.613 0-283.926 0-283.926-80.6v-16.593c0-154.178 127.35-279.573 283.926-279.573h168.488c156.576 0 283.95 125.427 283.95 279.573v16.593c0 80.6-131.58 80.6-283.95 80.6zM503.564 534.517c-123.987 0-224.869-99.409-224.869-221.572 0-122.154 100.882-221.572 224.869-221.572 123.987 0 224.869 99.385 224.869 221.572 0.008 122.196-100.882 221.572-224.869 221.572z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-jiantou-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M532.631 977.164v-880.71l344.913 344.933c7.969 7.969 20.652 7.849 28.561-0.039 7.949-7.949 7.869-20.753-0.081-28.682l-377.014-376.791c-3.62-5.502-9.548-9.325-16.606-9.325-5.037 0-9.467 2.022-13.006 5.037l-0.243-0.182-1.052 1.052c-0.020 0.020-0.041 0.041-0.061 0.061l-380.19 380.19c-7.788 7.788-7.909 20.713-0.020 28.622 7.949 7.949 20.692 7.929 28.561 0.039l345.783-345.763v881.561c0 11.285 9.061 20.288 20.227 20.288 11.246 0 20.227-9.082 20.227-20.288z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-touxiang" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M512 227.5c-74.1 0-134.3 60.3-134.3 134.3S437.9 496.2 512 496.2s134.3-60.3 134.3-134.3S586.1 227.5 512 227.5zM512 0C229.2 0 0 229.2 0 512s229.2 512 512 512c282.8 0 512-229.2 512-512S794.8 0 512 0zM749.9 780.1c-14 0-25.3-11.3-25.3-25.3 0-116-93.4-206.8-212.6-206.8s-212.6 90.8-212.6 206.8c0 14-11.3 25.3-25.3 25.3s-25.3-11.3-25.3-25.3c0-70.1 27.5-135.3 77.4-183.6 24.5-23.7 53.2-42.1 84.5-54.6-10.5-6.9-20.3-14.9-29.4-24-34.9-34.9-54.2-81.4-54.2-130.8 0-49.4 19.2-95.9 54.2-130.8 34.9-34.9 81.4-54.2 130.8-54.2 49.4 0 95.9 19.2 130.8 54.2C677.7 266 697 312.5 697 361.9c0 49.4-19.2 95.9-54.2 130.8-9.1 9.1-18.9 17.1-29.4 24 31.3 12.5 59.9 30.9 84.5 54.6 49.9 48.2 77.4 113.4 77.4 183.6C775.2 768.8 763.9 780.1 749.9 780.1z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-baoming" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M445.71648 828.67712H280.48896v165.22752a27.50976 27.50976 0 0 1-27.4944 27.53536h-27.5712a27.50464 27.50464 0 0 1-27.54048-27.48416v-165.27872H32.65536A27.53024 27.53024 0 0 1 5.12 801.14688v-27.54048a27.52 27.52 0 0 1 27.4944-27.53536h165.26848v-165.22752a27.51488 27.51488 0 0 1 27.49952-27.53024h27.5712a27.50976 27.50976 0 0 1 27.53536 27.49952v165.25824h165.22752a27.52 27.52 0 0 1 27.53536 27.4944v27.58144a27.53024 27.53024 0 0 1-27.53536 27.53024zM1024 777.9584c0 13.71648-0.79872 27.2384-2.18112 40.63744h-66.90816c0.13824-3.6864 0.62976-7.22944 0.62976-10.97216 0-164.52608-127.45216-283.84256-279.95136-321.55136 0.02048-1.72032 0.24064-3.38432 0.24064-5.10464 0-9.68704-0.89088-19.1488-1.96096-28.55936 14.73024-2.82112 41.63072-11.83744 48.64-14.79168 68.92032-28.66176 117.42208-96.56832 117.42208-175.8208 0-97.5104-73.4208-177.75616-168.00256-188.93824-4.33152-4.62848-8.98048-8.92928-13.60896-13.25568a165.51424 165.51424 0 0 0-17.8176-56.26368c3.84-0.18432 7.57248-0.77824 11.44832-0.77824 142.65856 0 258.29888 115.33824 258.29888 257.62304 0 83.74272-40.21248 157.91104-102.25152 204.96896C932.33152 520.448 1024 632.64256 1024 777.9584z" fill="#d93639" ></path>' +
    '' +
    '<path d="M840.75008 819.15392h-68.57216c-12.57984-164.16768-149.57056-295.11168-317.02528-295.11168-46.57664 0-90.624 10.43968-130.45248 28.58496l-55.26016-51.8144a384.17408 384.17408 0 0 1 51.01568-23.36768c-69.19168-46.60736-114.69312-125.55776-114.69312-215.08096C205.76256 119.11168 322.176 2.99008 465.78176 2.99008c143.60064 0 260.01408 116.11648 260.01408 259.37408 0 92.31872-48.50176 173.15328-121.35936 219.11552 134.912 55.39328 229.24288 184.85248 236.3136 337.67424zM659.79904 263.14752c0-106.5472-86.4512-192.896-193.08032-192.896-106.62912 0-193.05984 86.3488-193.05984 192.896 0 96.43008 70.89152 176.08192 163.36896 190.42304 7.5264 0.94208 21.02784 4.74624 54.64064 0.69632 94.8224-12.2368 168.13056-93.04576 168.13056-191.11936z" fill="#d93639" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-baoming-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M445.71648 828.67712H280.48896v165.22752a27.50976 27.50976 0 0 1-27.4944 27.53536h-27.5712a27.50464 27.50464 0 0 1-27.54048-27.48416v-165.27872H32.65536A27.53024 27.53024 0 0 1 5.12 801.14688v-27.54048a27.52 27.52 0 0 1 27.4944-27.53536h165.26848v-165.22752a27.51488 27.51488 0 0 1 27.49952-27.53024h27.5712a27.50976 27.50976 0 0 1 27.53536 27.49952v165.25824h165.22752a27.52 27.52 0 0 1 27.53536 27.4944v27.58144a27.53024 27.53024 0 0 1-27.53536 27.53024zM1024 777.9584c0 13.71648-0.79872 27.2384-2.18112 40.63744h-66.90816c0.13824-3.6864 0.62976-7.22944 0.62976-10.97216 0-164.52608-127.45216-283.84256-279.95136-321.55136 0.02048-1.72032 0.24064-3.38432 0.24064-5.10464 0-9.68704-0.89088-19.1488-1.96096-28.55936 14.73024-2.82112 41.63072-11.83744 48.64-14.79168 68.92032-28.66176 117.42208-96.56832 117.42208-175.8208 0-97.5104-73.4208-177.75616-168.00256-188.93824-4.33152-4.62848-8.98048-8.92928-13.60896-13.25568a165.51424 165.51424 0 0 0-17.8176-56.26368c3.84-0.18432 7.57248-0.77824 11.44832-0.77824 142.65856 0 258.29888 115.33824 258.29888 257.62304 0 83.74272-40.21248 157.91104-102.25152 204.96896C932.33152 520.448 1024 632.64256 1024 777.9584z" fill="#cdcdcd" ></path>' +
    '' +
    '<path d="M840.75008 819.15392h-68.57216c-12.57984-164.16768-149.57056-295.11168-317.02528-295.11168-46.57664 0-90.624 10.43968-130.45248 28.58496l-55.26016-51.8144a384.17408 384.17408 0 0 1 51.01568-23.36768c-69.19168-46.60736-114.69312-125.55776-114.69312-215.08096C205.76256 119.11168 322.176 2.99008 465.78176 2.99008c143.60064 0 260.01408 116.11648 260.01408 259.37408 0 92.31872-48.50176 173.15328-121.35936 219.11552 134.912 55.39328 229.24288 184.85248 236.3136 337.67424zM659.79904 263.14752c0-106.5472-86.4512-192.896-193.08032-192.896-106.62912 0-193.05984 86.3488-193.05984 192.896 0 96.43008 70.89152 176.08192 163.36896 190.42304 7.5264 0.94208 21.02784 4.74624 54.64064 0.69632 94.8224-12.2368 168.13056-93.04576 168.13056-191.11936z" fill="#cdcdcd" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-dianzan-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253" fill="#cdcdcd" ></path>' +
    '' +
    '<path d="M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819" fill="#cdcdcd" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)