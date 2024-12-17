import { useTranslation } from 'react-i18next'
import { FindStreamerQuery } from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import Stream from 'src/components/Stream/Stream/Stream'
import { useLiveTime } from 'src/hooks/useLiveTime'

type StreamerProps = CellSuccessProps<FindStreamerQuery>

const StreamerComponent = ({ streamer }: StreamerProps) => {
  const { t } = useTranslation()

  const { liveStream } = streamer

  return (
    <>
      {liveStream ? (
        <Stream stream={liveStream}>
          <LiveTime startDate={new Date(liveStream.createdAt)} />
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt,
            porro magni possimus in reprehenderit, amet, dolores suscipit
            inventore ad exercitationem excepturi cupiditate voluptate
            aspernatur provident odio quas laboriosam beatae at?
          </p>
          <p>
            Commodi recusandae minima accusamus, sunt dignissimos obcaecati
            molestiae laudantium reprehenderit eveniet! Consequuntur at eius
            odio maiores voluptatum sit quos! Nihil, atque inventore doloremque
            quod nobis quam libero culpa officia obcaecati?
          </p>
          <p>
            Vero, labore. A, libero accusamus! Quaerat veniam quis repudiandae,
            pariatur minus iusto ullam alias obcaecati! Voluptatum suscipit
            atque deserunt aspernatur explicabo delectus, quaerat officiis
            voluptate sequi, non maxime enim ipsam.
          </p>
          <p>
            Obcaecati modi quis distinctio at eaque, vel eos veniam. Eveniet
            optio maxime fuga? Pariatur commodi minus quidem libero in, saepe
            quas porro reprehenderit iusto sunt officia molestiae animi illum
            aliquid?
          </p>
          <p>
            Quia iure neque, id explicabo eum nisi inventore illum numquam
            cumque suscipit aperiam esse, reprehenderit totam autem veniam et
            ipsam consequatur ab doloremque doloribus praesentium impedit aut.
            Odit, magnam molestiae!
          </p>
          <p>
            Ipsa maxime assumenda error voluptas fugiat aperiam quaerat odio
            quos? Alias, illo nisi quae architecto nemo veritatis dolorum
            consequatur porro laudantium autem voluptatibus. Aut nesciunt
            suscipit dolores reprehenderit ea placeat!
          </p>
          <p>
            Itaque consequatur nostrum tenetur aspernatur corporis esse ducimus,
            blanditiis, voluptate molestiae qui, laudantium nesciunt recusandae
            porro delectus a et! Nostrum, at fuga sit eveniet commodi animi
            dignissimos modi optio aliquid.
          </p>
          <p>
            Aut id repudiandae esse dolorum amet, dolores temporibus non ipsum
            sapiente perferendis tempore cupiditate! Quam aliquid ratione
            asperiores laboriosam placeat sapiente officia quae blanditiis,
            assumenda est a praesentium quaerat unde.
          </p>
          <p>
            Eaque harum porro assumenda consequuntur beatae minima, ab quasi
            tempore distinctio perspiciatis officia reiciendis ipsa ex, amet
            aspernatur voluptas nemo repudiandae. Commodi maiores impedit
            voluptas dignissimos rerum! Maxime, iste molestias?
          </p>
          <p>
            Consequuntur quia atque ullam nam saepe magni officiis nulla, est
            voluptatem, cupiditate obcaecati. Provident itaque illum ipsam
            doloremque quod id ad atque, nobis amet nam ipsa rerum eius dolor
            perspiciatis.
          </p>
          <p>
            Sint perspiciatis aut aliquid incidunt laudantium at natus
            necessitatibus dignissimos velit pariatur. Laborum corrupti dolore
            vel est optio fuga, ipsam hic incidunt nobis eius aut animi, velit
            laboriosam vero non!
          </p>
          <p>
            Quibusdam sit non deleniti ratione eum at inventore, optio
            perferendis, quidem reprehenderit, porro quos. Iure, quaerat quas
            repudiandae provident sapiente eius laudantium blanditiis libero,
            minus dignissimos, in vel dicta. Similique.
          </p>
          <p>
            Aliquid obcaecati eligendi nesciunt dolorum quo cumque iusto quis
            voluptatibus accusamus voluptates quaerat, aspernatur doloribus id
            alias eaque aut adipisci, quos enim fugiat officiis? Dolor molestiae
            vero tempora consequuntur! Reprehenderit?
          </p>
          <p>
            Ducimus, sed error. Id molestiae, iure facilis dolore voluptates at
            et distinctio veritatis dolor porro laudantium quam accusantium
            ullam. Magnam cum voluptate dignissimos voluptatem deleniti natus
            eos error maxime atque?
          </p>
          <p>
            Tenetur, nobis eaque? Fuga ad fugit odio expedita. Optio quae nulla
            facilis fugiat excepturi enim. Recusandae quisquam, debitis at
            magnam velit quibusdam optio. Quae tempore deleniti ad quo culpa
            rerum.
          </p>
          <p>
            Quas eligendi nemo consectetur rem aperiam praesentium temporibus
            fuga nobis, neque quia tempora excepturi natus. Laborum distinctio
            nisi quam praesentium qui unde, quos autem. In iure alias nesciunt
            corrupti consectetur!
          </p>
          <p>
            Recusandae expedita dolore, sapiente eos accusantium, vero obcaecati
            odio aliquam autem ipsum ut repellendus deleniti dolores inventore
            atque earum quo praesentium. Itaque praesentium eos, accusantium id
            fugit laudantium. Nisi, porro?
          </p>
          <p>
            Libero magni repellat, aut pariatur odio modi dolore exercitationem
            eveniet dolorem debitis eaque. Aliquid expedita quaerat ratione
            minus excepturi temporibus vel asperiores ad. Consequatur, expedita.
            Voluptas aspernatur reprehenderit eaque quia?
          </p>
          <p>
            Aut ea praesentium optio, provident nostrum magni pariatur ullam
            vitae perspiciatis laborum rem. Molestias voluptas iste dolorum
            quaerat aspernatur perspiciatis repellendus tempora distinctio
            fugit, rem ipsa odio in molestiae sit.
          </p>
          <p>
            Natus, aliquid facere. Voluptatum natus, ex magni nesciunt debitis
            vitae architecto quibusdam fuga ducimus cumque nobis velit facilis
            consequatur vero ipsam saepe qui, sapiente facere repellat in
            corrupti animi mollitia.
          </p>
          <p>
            Quae odit hic quaerat magnam fugit culpa, incidunt architecto
            officiis. Consectetur in nam asperiores sunt repellendus dolorem
            odio nobis deleniti esse animi! Aliquam laboriosam, nam quam maiores
            maxime quis cumque?
          </p>
          <p>
            Quasi error ullam dolores voluptatum consectetur praesentium, autem,
            necessitatibus qui sed explicabo quibusdam inventore, libero aperiam
            nisi iste deserunt eaque sunt laudantium accusamus adipisci itaque
            nostrum omnis. Consequuntur, earum laudantium.
          </p>
          <p>
            Nesciunt temporibus nemo commodi consectetur delectus, neque tempora
            qui accusamus doloribus quod velit quae sit. Quo, sit, numquam vel
            quae, dolorem expedita suscipit doloremque nesciunt placeat minima
            impedit ea minus.
          </p>
          <p>
            Animi voluptatum velit, perspiciatis sint eos deleniti ducimus autem
            rerum consequuntur beatae sed aspernatur enim, illo dolor, molestias
            perferendis odio earum placeat distinctio dolorem. Commodi odit
            voluptates inventore magnam consequatur?
          </p>
          <p>
            Distinctio cum est earum blanditiis expedita beatae accusamus, ipsa
            laboriosam illo quibusdam, maiores, delectus dolore inventore at
            laudantium quo debitis vero velit accusantium ipsam quia. Laudantium
            corrupti optio dicta beatae!
          </p>
          <p>
            Nihil, aliquam. Dolorum harum necessitatibus, perspiciatis quae sit
            nemo odit natus, quibusdam fuga deserunt, dolor repellat tempora
            iure repudiandae molestias unde eius nam vel. Quasi culpa neque
            dolores doloribus rem!
          </p>
          <p>
            Consequuntur cumque iure laborum expedita, ad commodi mollitia
            voluptas quasi accusamus iusto facilis molestias excepturi,
            dignissimos labore facere maxime nam quam tenetur perferendis.
            Atque, odit. Perspiciatis quo tempore repudiandae architecto.
          </p>
          <p>
            Perferendis minus commodi sequi ullam optio exercitationem animi,
            asperiores, ipsa facilis quia, earum voluptatem. Eius expedita,
            autem quia vitae facere tenetur facilis sunt inventore sit, quae
            fugit, non dolorum velit!
          </p>
          <p>
            Qui neque praesentium, officia perferendis quo illum sed quia dicta,
            voluptatibus ad necessitatibus dolor doloremque aliquam expedita
            atque eligendi unde dolores illo deserunt itaque facilis adipisci
            accusantium! Laudantium, dolore enim.
          </p>
          <p>
            Adipisci illo nisi fugiat? Atque nisi id veritatis illo consequatur
            in magnam libero voluptatibus ad, architecto sunt nemo dolor? Beatae
            autem et rem magnam excepturi delectus placeat aliquam deleniti
            obcaecati.
          </p>
          <p>
            Nisi quidem necessitatibus excepturi neque dolore omnis rem unde,
            quos libero quasi commodi cumque provident saepe inventore culpa
            iusto. Delectus eaque esse cumque odio aliquam possimus eum quam aut
            totam.
          </p>
          <p>
            Repellat nulla officia esse, qui architecto tempore perferendis
            tempora saepe dolore modi reiciendis amet sit. Maiores, dignissimos
            doloremque iure eum, esse quam suscipit accusantium quaerat nesciunt
            fuga exercitationem natus ex.
          </p>
          <p>
            Consectetur perspiciatis reprehenderit velit, officiis libero
            commodi, iusto autem ab, quisquam ipsam cum! Distinctio dolores
            magni esse asperiores corporis ea tempore nihil explicabo eius!
            Neque voluptas quibusdam dolorem beatae sint!
          </p>
          <p>
            Culpa reiciendis saepe hic nihil alias voluptatibus veniam
            voluptates deserunt soluta quam quae eius cumque aspernatur nam ad
            amet at, facere perferendis ipsa sapiente incidunt laudantium
            labore? Quo, nihil corporis?
          </p>
          <p>
            Adipisci aperiam quod cumque iusto enim, sint molestiae, dolore
            ducimus commodi itaque dolorum maxime doloremque ipsa placeat
            tenetur officia accusantium quam nesciunt amet non unde? Culpa,
            suscipit officia? Repudiandae, error.
          </p>
          <p>
            Deserunt doloremque eius alias quos, animi molestiae accusamus
            cumque aliquid quae nostrum voluptatem repellat quisquam minus
            tempore provident. Officiis delectus suscipit sunt exercitationem,
            unde adipisci odit quia ipsam aliquid ex!
          </p>
          <p>
            Magni praesentium hic culpa aliquam placeat recusandae corporis
            vitae voluptatum beatae odio pariatur eos ea velit inventore quis,
            dignissimos exercitationem repellendus maxime consectetur iusto fuga
            atque eveniet corrupti ut? Nesciunt.
          </p>
          <p>
            Consequatur dolorum nobis voluptates, eligendi perspiciatis, nemo
            sed quos illum at, provident odit quas minima nam illo et? Nesciunt
            vel quo iure consequatur odit, pariatur eaque in nam dolores?
            Laboriosam.
          </p>
          <p>
            Sequi esse qui alias! Temporibus id atque iure blanditiis voluptatem
            minus aspernatur quo amet sapiente ipsam natus recusandae quod
            ratione fugiat, nemo sit deleniti! Eligendi, ipsum. Id, minus?
            Optio, ea!
          </p>
          <p>
            Est, voluptatem laborum itaque, ipsa voluptas labore nulla fuga
            architecto aut aspernatur porro, voluptatum hic! Sapiente tempore
            eius dignissimos impedit nam eos, quis, aperiam eveniet ratione
            placeat temporibus corrupti fuga?
          </p>
          <p>
            Eos optio consequatur placeat dicta odio nostrum quidem eum impedit
            sunt necessitatibus incidunt, animi, ab repellendus veniam minima,
            ea magni voluptatibus fuga numquam ducimus aut! Beatae similique
            perferendis hic velit.
          </p>
          <p>
            Qui aperiam veritatis architecto perferendis ipsa corrupti doloribus
            fugit quidem consequuntur itaque, nulla velit ducimus, cum iusto
            voluptas. Distinctio dolor vitae quia dicta exercitationem voluptate
            maxime aspernatur, eos tenetur praesentium?
          </p>
          <p>
            Provident, obcaecati repudiandae ut molestiae sunt quaerat maiores
            eum nihil, ipsum numquam assumenda earum vel enim, est possimus.
            Excepturi animi amet dolore id, aperiam tenetur doloribus porro
            vitae ullam laborum.
          </p>
          <p>
            Exercitationem, similique quam? Suscipit eius odio dolor assumenda
            dolorum quas. Recusandae, facilis. Explicabo nemo itaque quae
            asperiores culpa incidunt earum fugit repellat necessitatibus totam,
            exercitationem animi nostrum ipsum tempore blanditiis.
          </p>
          <p>
            Eum dolor dolores, inventore expedita sint dicta excepturi ipsam
            quibusdam repellat doloremque eius nulla dolorem, alias laboriosam,
            ipsa sit modi hic saepe tempora? Quisquam ipsum ipsam cumque magnam
            porro nemo.
          </p>
          <p>
            Maiores repellat, molestiae excepturi eligendi rem facere in
            reiciendis vero, aliquid dolore similique provident cupiditate ex
            nihil ut quis ipsum debitis veritatis sunt iure. Esse vero sint
            architecto atque aliquam!
          </p>
          <p>
            Amet, obcaecati! Praesentium, architecto! Id mollitia itaque numquam
            nesciunt consectetur at illo similique provident, quia repellendus
            asperiores eaque voluptas magnam voluptates quisquam, deserunt
            earum! Dignissimos assumenda soluta aliquid officia libero!
          </p>
          <p>
            Corporis odit illum eos repudiandae, deserunt et ab perferendis
            quibusdam eaque. Laudantium explicabo aspernatur cumque tempore
            dolores inventore ipsa, suscipit molestias rerum iste dignissimos
            adipisci enim. Magni, vitae neque. Exercitationem?
          </p>
          <p>
            Facere quaerat harum deserunt et. Tempore odit libero cumque aut
            impedit, accusantium, sequi suscipit nihil quisquam quis ullam ut
            rem, delectus quo consectetur. Blanditiis, fuga obcaecati et
            consequatur vitae est.
          </p>
          <p>
            Asperiores suscipit architecto ad ducimus molestiae perferendis
            doloremque corporis est, provident nostrum accusantium esse
            mollitia, necessitatibus iure veritatis ullam eius aperiam cumque
            sapiente quaerat? Repellat omnis aliquid explicabo illo odio.
          </p>
          <p>
            Eligendi reprehenderit perferendis a maiores error veritatis dolor
            reiciendis sunt qui deserunt eos iusto architecto recusandae
            consequatur earum sequi magnam quae labore laudantium enim
            similique, distinctio non nostrum. Hic, amet?
          </p>
          <p>
            Dolor recusandae reprehenderit facere corrupti atque quas, at vitae
            quia beatae est fugiat unde quaerat excepturi! Voluptatem deserunt
            quis laudantium hic nulla repellat. Omnis, non laudantium impedit
            pariatur adipisci dolore.
          </p>
          <p>
            Eius enim aspernatur sequi quaerat tenetur, magnam quae velit rem
            eum, ipsum animi qui sed veniam! Repudiandae ipsum incidunt, laborum
            officia, debitis provident voluptatibus aspernatur dolore maxime
            amet, odit expedita?
          </p>
          <p>
            Ab velit natus, quisquam autem optio, illum quod repellendus amet,
            repellat libero quia voluptatibus doloremque itaque necessitatibus
            et ipsam quos? Totam adipisci obcaecati sint, iusto mollitia magnam
            laborum beatae reiciendis.
          </p>
          <p>
            Ratione quod vitae minima? Optio cum ab enim aliquam quo hic dolor
            fugit aut a consectetur molestias modi veritatis temporibus, porro
            amet facilis velit fuga distinctio suscipit aliquid! Totam, quis.
          </p>
          <p>
            Placeat, eveniet saepe facilis veniam nam accusamus earum illo
            cupiditate quam quis qui id officia, est harum natus aut inventore,
            assumenda vitae eligendi voluptates. Cumque adipisci labore hic
            totam voluptates.
          </p>
          <p>
            Dicta esse maxime totam consequuntur quidem voluptate numquam ipsam
            itaque minus. Sunt quis velit eaque non et adipisci? Voluptatem
            amet, voluptas soluta tempore at architecto laudantium. Porro
            molestiae consequatur illo?
          </p>
          <p>
            A iste harum molestiae facere illum ipsum dolore tempora vero
            sapiente aperiam est eos itaque commodi, optio, unde velit,
            voluptates et ab. Odio saepe, perspiciatis asperiores quibusdam
            placeat quisquam. Explicabo.
          </p>
          <p>
            Consequatur doloribus quisquam, consectetur voluptas sint architecto
            laborum expedita quae, labore sunt saepe accusantium quaerat
            distinctio magni iure. Consequuntur asperiores rerum sunt fugiat?
            Corporis rerum explicabo, minus reprehenderit aliquid maxime.
          </p>
          <p>
            Quis sapiente voluptate incidunt blanditiis nisi saepe fugiat,
            quidem illum! Quasi voluptatum eaque ullam vitae amet placeat harum
            eveniet incidunt beatae! Error neque mollitia accusamus fugit
            ducimus sunt reprehenderit omnis!
          </p>
          <p>
            Tempora reprehenderit deleniti mollitia laborum, odio harum
            doloribus itaque sit quos iure quibusdam ea deserunt debitis eaque
            sint dolores ad quod. Aliquam repudiandae nulla nobis officiis
            tempora harum ipsa corporis.
          </p>
          <p>
            Rem harum magnam perferendis sunt, nobis provident iusto, ipsa
            fugiat quae in voluptatum. Deleniti error rerum rem, eaque ducimus
            nemo suscipit. Quidem doloremque accusamus vel cum sit consectetur
            animi harum.
          </p>
          <p>
            Ipsa, molestias explicabo veritatis perferendis repudiandae fuga
            nihil odio minima ad non sint porro, perspiciatis est! Ea atque,
            delectus dignissimos deleniti illum modi ratione, magni ipsa et fuga
            exercitationem reiciendis.
          </p>
          <p>
            Voluptate eius exercitationem necessitatibus quis? Consequatur
            eligendi, nam maiores distinctio voluptatum, in animi aliquid
            ratione reprehenderit labore architecto iure saepe esse possimus
            blanditiis at iste suscipit! Id magnam nisi provident.
          </p>
          <p>
            Accusamus, cumque tempora! Quibusdam aut, asperiores dicta nobis
            esse quas minus velit placeat aliquam possimus officiis
            reprehenderit eveniet et illum harum animi deleniti! Ipsam delectus
            eum nesciunt sed. Quos, earum.
          </p>
          <p>
            Quasi repellendus quis eum officiis fugit numquam consectetur natus
            quaerat laborum, praesentium magnam ab soluta deserunt neque? Aut
            magnam nam, maxime accusantium labore quis quia obcaecati! Earum
            error esse corrupti.
          </p>
          <p>
            Consequuntur voluptate, fuga perferendis, ullam eum tenetur
            reiciendis aspernatur quae rem itaque consectetur, laboriosam cum
            nemo possimus eos in vitae necessitatibus et distinctio incidunt
            expedita ipsa aperiam doloribus? Ullam, maxime.
          </p>
          <p>
            Veritatis excepturi illo, numquam reiciendis nisi repudiandae veniam
            sed, optio aliquam amet cum fuga nobis exercitationem omnis a
            debitis soluta? Molestiae voluptatum, necessitatibus accusantium
            facere tenetur dolorem libero delectus iusto.
          </p>
          <p>
            Labore voluptatibus architecto ipsa dolores aperiam fuga? Atque
            explicabo iste eveniet? Voluptatem similique maxime nihil fugit sit
            architecto. Delectus obcaecati harum aliquam eligendi? Laborum
            corrupti vitae veniam vel, perferendis eos.
          </p>
          <p>
            Doloremque consequuntur molestias, aliquid accusantium odio sunt a!
            Modi illum non sequi placeat qui saepe, ab deleniti quisquam hic,
            laborum veritatis. Ullam delectus minus eligendi nobis non nesciunt
            fuga qui?
          </p>
          <p>
            Adipisci ea alias debitis perspiciatis qui illo quas laudantium
            inventore. Ea nisi qui enim, ratione magni quas odio perferendis
            cumque, doloremque fugiat maiores doloribus debitis corrupti
            dolorum, tempora nesciunt est!
          </p>
          <p>
            Eum repudiandae, repellendus consequatur quas amet delectus est
            iusto dolores. Eius libero cupiditate, minima, ipsa natus autem qui
            obcaecati debitis totam aliquid voluptate adipisci aperiam quaerat
            corporis corrupti ab beatae.
          </p>
          <p>
            Quibusdam, asperiores quidem alias doloribus aliquam, modi nisi
            repellat iusto beatae debitis quas aperiam neque magnam accusamus
            praesentium quam ea aspernatur perferendis amet natus dolores?
            Nesciunt eveniet expedita aspernatur rem.
          </p>
          <p>
            Veritatis praesentium laudantium voluptas dolor quidem obcaecati,
            labore temporibus eum illo ex? Tempora eligendi natus consequuntur
            voluptatem, animi architecto nostrum pariatur ipsam debitis
            voluptate, suscipit deserunt ad dolor, error ipsum.
          </p>
          <p>
            Reiciendis excepturi laudantium totam consectetur officiis obcaecati
            aliquam quae repellendus quis ab eveniet vero suscipit blanditiis
            culpa consequatur, facilis quisquam dolorem. Repellat ut, reiciendis
            commodi voluptate porro earum hic eligendi!
          </p>
          <p>
            Blanditiis, adipisci sunt. Debitis voluptate itaque reiciendis,
            ratione quisquam minima maxime vitae qui culpa, quam quas excepturi
            inventore impedit nisi. Harum quos, tempore vel nobis aspernatur
            aliquam voluptas quod nam!
          </p>
          <p>
            Nisi deserunt tempora magni iusto consectetur in ipsa quidem maiores
            fugiat ratione reprehenderit assumenda molestiae ab eum vel
            possimus, quaerat doloribus voluptatem sint cumque a odit excepturi
            optio. Accusamus, deserunt?
          </p>
          <p>
            Blanditiis consequuntur suscipit nam accusamus officiis doloribus
            ipsum expedita inventore provident dignissimos? Quibusdam, qui quam
            iusto illo veritatis nulla omnis modi perspiciatis quas assumenda
            enim ducimus incidunt obcaecati ratione praesentium?
          </p>
          <p>
            Velit, eos dolorem quibusdam explicabo minima voluptate
            necessitatibus, adipisci deserunt non beatae quae, dignissimos
            similique asperiores aspernatur quos dolor omnis incidunt
            voluptatibus esse. Recusandae sed, nobis voluptates ullam nihil
            iste.
          </p>
          <p>
            Rem fugiat quidem aliquam necessitatibus perspiciatis eos, illo,
            mollitia amet, maxime hic officia doloribus dignissimos architecto
            tenetur! Laborum enim aspernatur eos, suscipit a illum. Magni
            dolorum recusandae veritatis delectus aut.
          </p>
          <p>
            Dolor temporibus aliquid nostrum. Eius, aliquid aspernatur error
            consequatur laborum doloremque iure non, amet nulla ipsa est
            corrupti suscipit soluta! Inventore dicta ex tempore ratione
            laboriosam minima et possimus reprehenderit.
          </p>
          <p>
            A nesciunt mollitia ratione. Cumque culpa, praesentium ratione
            libero, error quasi amet esse fugiat est facilis nesciunt laboriosam
            laborum cupiditate sequi odio debitis ex hic? Illum ullam iste modi
            voluptate.
          </p>
          <p>
            Commodi quae porro quo cupiditate magnam temporibus, optio at quasi
            enim similique molestiae laborum culpa? Perferendis quas molestiae
            assumenda quae consectetur dolor at distinctio quibusdam aliquam
            numquam, eaque quaerat quod?
          </p>
          <p>
            Magnam ad fuga facere ut eius at a sint perspiciatis enim, impedit
            ipsum suscipit inventore voluptatibus? Reprehenderit, dolorem
            asperiores, iste maiores similique eos eius ea rerum quis deserunt
            sed ipsam!
          </p>
          <p>
            Delectus aliquam possimus, magni ipsa dolorum adipisci! Ab optio
            doloremque velit vero libero esse, quis corrupti fugit distinctio
            modi impedit, totam tenetur magni voluptate nesciunt quos.
            Voluptatibus provident culpa quasi.
          </p>
          <p>
            A, officiis ratione. Doloremque quam deserunt incidunt enim saepe.
            Hic dolorem aspernatur assumenda at magnam fugit excepturi! Omnis
            quo sed, dolores qui sit magni assumenda nesciunt ipsa ut
            repudiandae quam.
          </p>
          <p>
            Amet optio itaque porro accusantium repellendus nihil adipisci nulla
            neque totam ipsam nostrum veritatis et dicta, omnis in, voluptates
            ad alias placeat ullam ea. Ducimus delectus quas cupiditate neque
            aspernatur.
          </p>
          <p>
            Eligendi expedita ducimus quod illo ut ab! Iure ipsum eos quae
            suscipit laudantium eveniet quasi, maxime ipsam. Accusantium vitae
            facere aliquid, sit maxime odit voluptatem molestiae, animi
            consequatur enim illum!
          </p>
          <p>
            Veritatis modi aut tempore, alias et beatae vero, ad omnis dicta,
            provident cumque natus at animi saepe unde aliquid sit voluptate
            dolorem! Eveniet commodi nostrum earum necessitatibus repudiandae
            quae fuga?
          </p>
          <p>
            Enim error corrupti tempore eum sequi laudantium aperiam nisi
            placeat, quod quae laboriosam deleniti eius id iure optio
            reprehenderit quo totam modi temporibus dignissimos iste! Nostrum
            iure ea porro excepturi.
          </p>
          <p>
            Neque suscipit molestiae dignissimos odit porro eius maiores, rerum
            sapiente ex nulla ipsum, sequi necessitatibus quia impedit quasi
            expedita temporibus culpa perferendis distinctio officiis? Voluptas,
            corrupti est! In, vitae ullam!
          </p>
          <p>
            Facere, nam! Enim neque necessitatibus provident ducimus ullam,
            laudantium tempora consectetur non quaerat totam unde eius accusamus
            architecto reiciendis assumenda nobis cupiditate dicta perspiciatis
            laboriosam officia quas nihil! Obcaecati, deserunt!
          </p>
          <p>
            Vero vitae, omnis aspernatur architecto beatae dolorem totam.
            Impedit soluta dignissimos id suscipit ducimus eos minima enim alias
            excepturi! Impedit aspernatur expedita laudantium repellendus fugiat
            vero itaque culpa similique distinctio.
          </p>
          <p>
            Praesentium molestias, quod fugit consequuntur saepe ipsum earum
            facilis asperiores ipsa cumque placeat, quas pariatur magnam
            expedita corrupti soluta qui totam voluptatum fuga magni a veniam
            architecto consequatur. Quo, hic!
          </p>
          <p>
            Amet, beatae! Reprehenderit ullam necessitatibus nesciunt. Ipsam
            expedita ducimus culpa vel quidem id modi excepturi cumque dolores
            rerum quasi, veniam sapiente dolore neque suscipit error quas
            explicabo velit perferendis eligendi.
          </p>
          <p>
            Asperiores ab quasi molestiae iusto voluptatem praesentium, magni
            debitis eum, itaque numquam, inventore voluptas mollitia commodi
            voluptatum! Totam laboriosam eos nemo commodi amet eius, vitae odit
            iure, ex facere ipsam?
          </p>
          <p>
            Architecto voluptatibus repellat consequatur libero officia, placeat
            temporibus obcaecati distinctio illum quaerat quasi. Accusantium
            omnis, quidem atque dignissimos inventore sunt repudiandae, facere
            totam, beatae deserunt fugit quod repellendus! Ipsa, unde.
          </p>
          <p>
            Nostrum nam rerum odit voluptates possimus ipsam libero perspiciatis
            commodi neque aspernatur doloremque tempora debitis iste repudiandae
            eius quo, animi voluptas, dignissimos consequuntur sunt mollitia
            facere! Quo dignissimos iusto aspernatur?
          </p>
          <p>
            Excepturi facilis repellendus sint quisquam. Asperiores cupiditate
            fugiat rem quisquam, numquam eaque suscipit sed sit, iure, voluptas
            tenetur culpa soluta omnis amet. Quod dolorum distinctio nulla
            officiis sed tempora ea?
          </p>
          <p>
            Reprehenderit exercitationem voluptate, incidunt velit qui sunt
            explicabo repellat unde quo similique voluptatum eveniet?
            Voluptatibus, quas molestias corrupti praesentium adipisci magnam.
            Eveniet cumque placeat minima architecto accusamus, labore ab natus!
          </p>
        </Stream>
      ) : (
        <>{t('streamer.not-live')}</>
      )}
    </>
  )
}

type LiveTimeProps = {
  startDate: Date
}

const LiveTime = ({ startDate }: LiveTimeProps) => {
  const { t } = useTranslation()
  const { formattedTime } = useLiveTime(startDate)
  return <div>{t('streamer.live-for', { duration: formattedTime })}</div>
}

export default StreamerComponent
